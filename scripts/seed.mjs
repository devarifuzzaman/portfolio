// npm run seed          -> safe to run repeatedly: inserts what is missing, never overwrites your edits.
// npm run seed -- --force -> also overwrites the site_content sections (not projects) with data.js values.
import { MongoClient } from 'mongodb'
import { readFileSync, existsSync } from 'node:fs'
import * as data from '../src/data.js'
import { buildContent } from '../src/lib/mapData.js'

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
const uri = process.env.MONGODB_URI
if (!uri) { console.error('MONGODB_URI is not set. Add it to .env (see .env.example).'); process.exit(1) }

const force = process.argv.includes('--force')
const { content, projects } = buildContent(data)
content.profile = { ...content.profile, email: content.profile.email || process.env.VITE_CONTACT_EMAIL || '' }

const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 10000 }).connect()
try {
  const db = client.db(process.env.MONGODB_DB || 'portfolio')
  const col = db.collection('projects')
  await col.createIndex({ slug: 1 }, { unique: true })
  const now = new Date()
  const stats = { inserted: 0, filled: 0, untouched: 0, sections: 0 }

  for (const [i, p] of projects.entries()) {
    const existing = await col.findOne({ slug: p.slug })
    if (!existing) { await col.insertOne({ ...p, order: i, createdAt: now, updatedAt: now }); stats.inserted++; continue }
    // Only add fields the record doesn't have yet. Anything you've edited or cleared stays as it is.
    const patch = {}
    for (const [k, v] of Object.entries({ ...p, order: i })) if (existing[k] === undefined) patch[k] = v
    if (Object.keys(patch).length) { await col.updateOne({ _id: existing._id }, { $set: { ...patch, updatedAt: now } }); stats.filled++ } else stats.untouched++
  }

  const site = db.collection('site_content')
  for (const [key, value] of Object.entries(content)) {
    const r = force
      ? await site.updateOne({ _id: key }, { $set: { data: value, updatedAt: now }, $setOnInsert: { createdAt: now } }, { upsert: true })
      : await site.updateOne({ _id: key }, { $setOnInsert: { data: value, createdAt: now, updatedAt: now } }, { upsert: true })
    if (r.upsertedCount || (force && r.modifiedCount)) stats.sections++
  }

  console.log(`Projects: ${stats.inserted} inserted, ${stats.filled} completed with new fields, ${stats.untouched} already up to date.`)
  console.log(`Site content: ${stats.sections} of ${Object.keys(content).length} sections written${force ? ' (forced)' : ''}.`)
  console.log(`Totals now in database -> projects: ${await col.countDocuments()}, site_content: ${await site.countDocuments()}.`)
} finally { await client.close() }
