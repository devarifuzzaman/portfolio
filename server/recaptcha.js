// Server-side reCAPTCHA v3 check. Supports Google Cloud (Enterprise) keys and classic v3 secret keys.
const E = () => process.env
export const recaptchaEnabled = () => Boolean(E().RECAPTCHA_SECRET || (E().RECAPTCHA_PROJECT_ID && E().RECAPTCHA_API_KEY))

export async function verifyRecaptcha(token, action, ip) {
  if (!recaptchaEnabled()) return { ok: true, skipped: true }
  if (!token || typeof token !== 'string') return { ok: false, reason: 'missing' }
  const min = Number(E().RECAPTCHA_MIN_SCORE || 0.5)
  try {
    let valid, act, score
    if (E().RECAPTCHA_PROJECT_ID && E().RECAPTCHA_API_KEY) {
      const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(E().RECAPTCHA_PROJECT_ID)}/assessments?key=${encodeURIComponent(E().RECAPTCHA_API_KEY)}`
      const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(6000),
        body: JSON.stringify({ event: { token, siteKey: E().RECAPTCHA_SITE_KEY || E().VITE_RECAPTCHA_SITE_KEY, expectedAction: action, userIpAddress: ip } }),
      })
      if (!r.ok) throw new Error(`assessment ${r.status}`)
      const j = await r.json()
      valid = j.tokenProperties?.valid; act = j.tokenProperties?.action; score = j.riskAnalysis?.score
    } else {
      const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: AbortSignal.timeout(6000),
        body: new URLSearchParams({ secret: E().RECAPTCHA_SECRET, response: token, remoteip: ip }),
      })
      const j = await r.json()
      valid = j.success; act = j.action; score = j.score
    }
    const ok = Boolean(valid) && act === action && Number(score) >= min
    return ok ? { ok, score } : { ok: false, reason: 'failed', score }
  } catch (e) {
    console.error('reCAPTCHA check unavailable:', e.message)
    return { ok: false, reason: 'unavailable' }
  }
}
