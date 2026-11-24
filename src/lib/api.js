export async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) { const e = new Error(data.error || `Request failed (${r.status})`); e.details = data.details || []; e.status = r.status; throw e }
  return data
}
