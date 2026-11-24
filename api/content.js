import { getDb } from '../server/db.js'
import { send, readBody, query, fail } from '../server/http.js'
import { requireAuth } from '../server/auth.js'
import { sanitize, CONTENT_SHAPES } from '../server/validate.js'

// Admin: read and edit the website sections stored in the `site_content` collection.
export default async function handler(req, res) {
  if (!requireAuth(req, res)) return
  try {
    const col = (await getDb()).collection('site_content')
    if (req.method === 'GET') {
      const docs = await col.find().toArray()
      return send(res, 200, { content: Object.fromEntries(docs.map((d) => [d._id, d.data])) })
    }
    if (req.method === 'PUT') {
      const key = query(req).get('key')
      const shape = CONTENT_SHAPES[key]
      if (!shape) return send(res, 400, { error: 'Unknown section.' })
      const { data } = await readBody(req)
      if ((shape === 'array') !== Array.isArray(data) || data === null || typeof data !== 'object') return send(res, 422, { error: `This section must be ${shape === 'array' ? 'a list [ ]' : 'an object { }'}.` })
      const clean = sanitize(data)
      await col.updateOne({ _id: key }, { $set: { data: clean, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true })
      return send(res, 200, { ok: true, data: clean })
    }
    send(res, 405, { error: 'Method not allowed' })
  } catch (e) { fail(res, e) }
}
