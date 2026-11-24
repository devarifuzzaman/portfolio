import { getDb } from '../server/db.js'
import { send, fail } from '../server/http.js'

// Public: everything the website needs in one request.
export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' })
  try {
    const db = await getDb()
    const [docs, projects] = await Promise.all([
      db.collection('site_content').find().toArray(),
      db.collection('projects').find({ status: { $ne: 'draft' } }).sort({ order: 1, createdAt: 1 }).toArray(),
    ])
    send(res, 200, {
      content: Object.fromEntries(docs.map((d) => [d._id, d.data])),
      projects: projects.map(({ _id, ...p }) => ({ id: String(_id), ...p })),
    })
  } catch (e) { fail(res, e) }
}
