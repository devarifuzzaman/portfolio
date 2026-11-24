export function send(res, code, body, headers = {}) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v))
  res.end(JSON.stringify(body))
}
export async function readBody(req, limit = 3_000_000) {
  if (req.body && typeof req.body === 'object') return req.body
  let s = ''
  for await (const c of req) { s += c; if (s.length > limit) break }
  try { return JSON.parse(s || '{}') } catch { return {} }
}
export const query = (req) => new URL(req.url, 'http://localhost').searchParams
export const clientIp = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
export function sameOrigin(req) {
  const o = req.headers.origin
  if (!o) return true
  try { return new URL(o).host === req.headers.host } catch { return false }
}
export function fail(res, e) {
  console.error(e)
  if (e?.code === 11000) return send(res, 409, { error: 'That record already exists.' })
  if (String(e?.message).includes('MONGODB_URI')) return send(res, 500, { error: 'Database is not configured. Set MONGODB_URI.' })
  send(res, 500, { error: 'Database error. Please try again.' })
}
