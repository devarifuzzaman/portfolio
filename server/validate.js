const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const arr = (v, max) => (Array.isArray(v) ? v.slice(0, max) : [])
const imgUrl = (v) => { const s = str(v, 600); return /^(https?:\/\/|\/)/i.test(s) ? s : '' }

export const ICONS = ['', 'check', 'bolt', 'speed', 'seo', 'shield', 'edit', 'device']
export const TITLE_KEYS = ['overview', 'challenge', 'approach', 'gallery', 'deliverables', 'technologies', 'related']
export const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

export function cleanProject(b = {}) {
  const errors = []
  const name = str(b.name, 120)
  if (!name) errors.push('Project name is required.')
  const url = str(b.url, 500)
  if (url && !/^https?:\/\//i.test(url)) errors.push('Live URL must start with http:// or https://.')
  const completedAt = str(b.completedAt, 10)
  if (completedAt && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(completedAt)) errors.push('Completion date must look like 2026, 2026-03 or 2026-03-15.')
  const approach = arr(b.approach, 12).map((a) => ({ title: str(a?.title, 120), text: str(a?.text, 1200) })).filter((a) => a.title || a.text)
  if (approach.some((a) => !a.title)) errors.push('Every approach step needs a heading.')
  const titles = {}
  for (const k of TITLE_KEYS) { const t = str(b.titles?.[k], 80); if (t) titles[k] = t }
  const doc = {
    name, url, type: str(b.type, 80), summary: str(b.summary, 600),
    status: b.status === 'draft' ? 'draft' : 'published',
    image: imgUrl(b.image),
    tags: arr(b.tags, 20).map((t) => str(t, 40)).filter(Boolean),
    overview: str(b.overview, 5000),
    objectives: arr(b.objectives, 12).map((o) => str(o, 300)).filter(Boolean),
    challenge: str(b.challenge, 5000),
    titles, approach,
    deliverables: arr(b.deliverables, 16).map((d) => ({ text: str(d?.text, 300), icon: ICONS.includes(d?.icon) ? d.icon : '' })).filter((d) => d.text),
    gallery: arr(b.gallery, 12).map((g) => ({ url: imgUrl(g?.url), alt: str(g?.alt, 200) })).filter((g) => g.url),
    client: str(b.client, 150), completedAt,
  }
  return { errors, doc }
}

export function cleanInquiry(b = {}) {
  const errors = []
  const doc = { name: str(b.name, 100), email: str(b.email, 200), type: str(b.type, 80), message: str(b.message, 5000) }
  if (!doc.name) errors.push('Name is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doc.email)) errors.push('A valid email is required.')
  if (!doc.message) errors.push('Message is required.')
  return { errors, doc }
}

// Site content: strips Mongo operators and caps size/depth.
export function sanitize(v, depth = 0) {
  if (depth > 7) return null
  if (typeof v === 'string') return v.slice(0, 5000)
  if (typeof v === 'number' || typeof v === 'boolean' || v === null) return v
  if (Array.isArray(v)) return v.slice(0, 200).map((x) => sanitize(x, depth + 1))
  if (typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith('$') && !k.includes('.')).slice(0, 60).map(([k, x]) => [k, sanitize(x, depth + 1)]))
  return null
}
export const CONTENT_SHAPES = {
  profile: 'object', hero: 'object', about: 'object', settings: 'object', marquee: 'object',
  stats: 'array', specSheet: 'array', services: 'array', skills: 'array', experience: 'array', education: 'array',
  certifications: 'array', testimonials: 'array', strengths: 'array', process: 'array', faqs: 'array',
}
