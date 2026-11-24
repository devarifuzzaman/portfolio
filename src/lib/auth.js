const call = (method, body) =>
  fetch('/api/auth', { method, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
    .then(async (r) => ({ ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) }))
export const getSession = () => call('GET').then((r) => r.ok && r.data.authenticated).catch(() => false)
export const login = (username, password) => call('POST', { username, password }).catch(() => ({ ok: false, data: { error: 'Could not reach the server.' } }))
export const logout = () => call('DELETE').catch(() => null)
