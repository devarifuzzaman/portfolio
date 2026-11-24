import { ObjectId } from 'mongodb'
import { getDb } from '../server/db.js'
import { send, readBody, query, fail, clientIp, sameOrigin } from '../server/http.js'
import { requireAuth } from '../server/auth.js'
import { cleanInquiry } from '../server/validate.js'
import { verifyRecaptcha } from '../server/recaptcha.js'

const hits = new Map()
const pub = ({ _id, ...i }) => ({ id: String(_id), ...i })

export default async function handler(req, res) {
  try {
    const col = (await getDb()).collection('inquiries')

    if (req.method === 'POST') { // public contact form
      if (!sameOrigin(req)) return send(res, 403, { error: 'Request blocked.' })
      const body = await readBody(req)
      if (body.botcheck) return send(res, 200, { ok: true })
      const ip = clientIp(req), now = Date.now()
      const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000)
      if (recent.length >= 5) return send(res, 429, { error: 'Too many messages. Please try again later.' })
      const { errors, doc } = cleanInquiry(body)
      if (errors.length) return send(res, 422, { error: errors[0], details: errors })
      const v = await verifyRecaptcha(body.recaptchaToken, 'contact', ip)
      if (!v.ok) return v.reason === 'unavailable'
        ? send(res, 503, { error: 'The spam check is unavailable. Please try again.' })
        : send(res, 403, { error: 'Spam check failed. Please try again, or email me directly.' })
      recent.push(now); hits.set(ip, recent)
      await col.insertOne({ ...doc, status: 'new', createdAt: new Date() })
      return send(res, 201, { ok: true })
    }

    if (!requireAuth(req, res)) return
    if (req.method === 'GET') {
      const list = await col.find().sort({ createdAt: -1 }).limit(500).toArray()
      return send(res, 200, { inquiries: list.map(pub) })
    }
    const id = query(req).get('id')
    if (!ObjectId.isValid(id || '')) return send(res, 400, { error: 'Invalid id.' })
    if (req.method === 'PATCH') {
      const { status } = await readBody(req)
      if (!['new', 'read', 'replied'].includes(status)) return send(res, 422, { error: 'Invalid status.' })
      await col.updateOne({ _id: new ObjectId(id) }, { $set: { status } })
      return send(res, 200, { ok: true })
    }
    if (req.method === 'DELETE') { await col.deleteOne({ _id: new ObjectId(id) }); return send(res, 200, { ok: true }) }
    send(res, 405, { error: 'Method not allowed' })
  } catch (e) { fail(res, e) }
}
