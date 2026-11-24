import { getDb } from '../server/db.js'
import { send, readBody, query, fail } from '../server/http.js'
import { requireAuth } from '../server/auth.js'
import { cleanProject, slugify } from '../server/validate.js'

const pub = ({ _id, ...p }) => ({ id: String(_id), ...p })
const invalid = (res, errors) => send(res, 422, { error: 'Please fix the problems below.', details: errors })

export default async function handler(req, res) {
  try {
    const col = (await getDb()).collection('projects')
    const q = query(req)

    if (req.method === 'GET') {
      const all = q.get('all') === '1'
      if (all && !requireAuth(req, res)) return
      const list = await col.find(all ? {} : { status: { $ne: 'draft' } }).sort({ order: 1, createdAt: 1 }).toArray()
      return send(res, 200, { projects: list.map(pub) })
    }
    if (!requireAuth(req, res)) return

    if (req.method === 'POST') {
      const { errors, doc } = cleanProject(await readBody(req))
      if (errors.length) return invalid(res, errors)
      const base = slugify(doc.name) || 'project'
      let slug = base, n = 2
      while (await col.findOne({ slug }, { projection: { _id: 1 } })) slug = `${base}-${n++}`
      const last = await col.find().sort({ order: -1 }).limit(1).toArray()
      const now = new Date()
      const full = { ...doc, slug, order: (last[0]?.order ?? -1) + 1, createdAt: now, updatedAt: now }
      const r = await col.insertOne(full)
      return send(res, 201, { project: pub({ ...full, _id: r.insertedId }) })
    }

    const slug = q.get('slug')
    if (!slug) return send(res, 400, { error: 'Missing slug.' })

    if (req.method === 'PUT') {
      const existing = await col.findOne({ slug })
      if (!existing) return send(res, 404, { error: 'Project not found.' })
      // Merge so partial updates (like toggling status) never wipe other fields.
      const { errors, doc } = cleanProject({ ...existing, ...(await readBody(req)) })
      if (errors.length) return invalid(res, errors)
      const updated = await col.findOneAndUpdate({ slug }, { $set: { ...doc, updatedAt: new Date() } }, { returnDocument: 'after' })
      return send(res, 200, { project: pub(updated) })
    }
    if (req.method === 'DELETE') {
      const r = await col.deleteOne({ slug })
      return r.deletedCount ? send(res, 200, { ok: true }) : send(res, 404, { error: 'Project not found.' })
    }
    send(res, 405, { error: 'Method not allowed' })
  } catch (e) { fail(res, e) }
}
