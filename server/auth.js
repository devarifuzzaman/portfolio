import crypto from 'node:crypto'
import { send, readBody, clientIp, sameOrigin } from './http.js'

const MAX_AGE = 60 * 60 * 8 // 8 hours
const attempts = new Map()
const sign = (v, secret) => crypto.createHmac('sha256', secret).update(v).digest('hex')
const safeEq = (a, b) => crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest())
const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map((c) => c.trim().split(/=(.*)/s).slice(0, 2)).filter((a) => a[0]))

export function isAuthed(req) {
  const S = process.env.AUTH_SECRET
  if (!S || S.length < 16) return false
  const t = cookies(req).session
  if (!t) return false
  const [exp, sig] = t.split('.')
  return Boolean(sig) && Number(exp) > Date.now() && sig.length === 64 && safeEq(sig, sign(exp, S))
}

// Use at the top of any protected route: `if (!requireAuth(req, res)) return`
export function requireAuth(req, res) {
  if (!isAuthed(req)) { send(res, 401, { error: 'Please sign in to the dashboard.' }); return false }
  if (req.method !== 'GET' && !sameOrigin(req)) { send(res, 403, { error: 'Request blocked.' }); return false }
  return true
}

export async function authHandler(req, res) {
  const { DASH_USER: U, DASH_PASSWORD: P, AUTH_SECRET: S } = process.env
  if (!U || !P || !S || S.length < 16) return send(res, 500, { error: 'Dashboard login is not configured. Set DASH_USER, DASH_PASSWORD and AUTH_SECRET.' })
  const secure = String(req.headers['x-forwarded-proto'] || '').includes('https')
  const flags = `Path=/; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`

  if (req.method === 'GET') return send(res, 200, { authenticated: isAuthed(req) })
  if (req.method === 'DELETE') return send(res, 200, { ok: true }, { 'Set-Cookie': `session=; Max-Age=0; ${flags}` })
  if (req.method === 'POST') {
    const ip = clientIp(req), now = Date.now()
    const recent = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000)
    if (recent.length >= 5) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' })
    const { username = '', password = '' } = await readBody(req)
    const ok = safeEq(username, U) & safeEq(password, P)
    if (!ok) { recent.push(now); attempts.set(ip, recent); return send(res, 401, { error: 'Incorrect username or password.' }) }
    attempts.delete(ip)
    const exp = String(now + MAX_AGE * 1000)
    return send(res, 200, { ok: true }, { 'Set-Cookie': `session=${exp}.${sign(exp, S)}; Max-Age=${MAX_AGE}; ${flags}` })
  }
  send(res, 405, { error: 'Method not allowed' })
}
