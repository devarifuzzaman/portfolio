import { MongoClient } from 'mongodb'

let indexed = false
export async function getDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set.')
  if (!globalThis.__mongo) {
    globalThis.__mongo = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((e) => { globalThis.__mongo = undefined; throw e })
  }
  const db = (await globalThis.__mongo).db(process.env.MONGODB_DB || 'portfolio')
  if (!indexed) { await db.collection('projects').createIndex({ slug: 1 }, { unique: true }); indexed = true }
  return db
}
