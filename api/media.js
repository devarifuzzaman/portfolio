import { Binary, ObjectId } from 'mongodb'
import { getDb } from '../server/db.js'
import { send, readBody, query, fail } from '../server/http.js'
import { requireAuth } from '../server/auth.js'

const MAX = 2 * 1024 * 1024

// POST (admin): store a compressed gallery image in MongoDB. GET ?id=: serve it publicly.
export default async function handler(req, res) {
  try {
    const col = (await getDb()).collection('media')
    if (req.method === 'GET') {
      const id = query(req).get('id') || ''
      const doc = ObjectId.isValid(id) ? await col.findOne({ _id: new ObjectId(id) }) : null
      if (!doc) return send(res, 404, { error: 'Not found.' })
      res.statusCode = 200
      res.setHeader('Content-Type', doc.contentType)
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      return res.end(Buffer.from(doc.data.buffer))
    }
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return
      const m = /^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=]+)$/.exec(String((await readBody(req)).data || ''))
      if (!m) return send(res, 422, { error: 'Upload a JPG, PNG or WebP image.' })
      const buf = Buffer.from(m[2], 'base64')
      if (buf.length > MAX) return send(res, 413, { error: 'Image is too large (2 MB max after compression).' })
      const r = await col.insertOne({ contentType: m[1], data: new Binary(buf), createdAt: new Date() })
      return send(res, 201, { url: `/api/media?id=${r.insertedId}` })
    }
    send(res, 405, { error: 'Method not allowed' })
  } catch (e) { fail(res, e) }
}
