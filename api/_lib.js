import crypto from 'node:crypto'
import { MongoClient } from 'mongodb'

export const sign = (v, secret) => crypto.createHmac('sha256', secret).update(v).digest('hex')
export const safeEq = (a, b) => crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest())
export const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map((c) => c.trim().split(/=(.*)/s).slice(0, 2)).filter((a) => a[0]))
export const query = (req) => Object.fromEntries(new URL(req.url || '/', 'http://x').searchParams)

export function send(res, code, body, headers = {}) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v))
  res.end(JSON.stringify(body))
}
export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  let s = ''
  for await (const c of req) s += c
  try { return JSON.parse(s || '{}') } catch { return {} }
}
export function isAuthed(req) {
  const S = process.env.AUTH_SECRET
  if (!S || S.length < 16) return false
  const t = cookies(req).session
  if (!t) return false
  const [exp, sig] = t.split('.')
  return Boolean(sig) && sig.length === 64 && Number(exp) > Date.now() && safeEq(sig, sign(exp, S))
}
export async function db() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw Object.assign(new Error('Database is not configured.'), { status: 503 })
  global._mongo ||= new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 }).connect()
  return (await global._mongo).db(process.env.MONGODB_DB || 'portfolio')
}
export const route = (fn) => async (req, res) => {
  try { await fn(req, res) } catch (e) {
    console.error(e)
    send(res, e.status || 503, { error: e.status ? e.message : 'Database unavailable.' })
  }
}
