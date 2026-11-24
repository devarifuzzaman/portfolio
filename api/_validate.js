const s = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const arr = (v, max) => (Array.isArray(v) ? v.slice(0, max) : [])
const localOrHttp = (u) => /^(https?:\/\/|\/)/.test(u)
const ICONS = ['check', 'dot', 'bolt', 'star', 'shield', 'gauge']
export const slugify = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Validates and sanitises incoming project data. Optional fields default to empty values.
export function cleanProject(input = {}) {
  const e = {}
  const name = s(input.name, 120)
  if (!name) e.name = 'Name is required.'
  const slug = s(input.slug, 80).toLowerCase() || slugify(name)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) e.slug = 'Slug can only contain lowercase letters, numbers and hyphens.'
  const url = s(input.url, 300)
  if (url && !/^https?:\/\//.test(url)) e.url = 'Live URL must start with http:// or https://'
  const image = s(input.image, 500)
  if (image && !localOrHttp(image)) e.image = 'Main image must be a valid URL.'
  const gallery = arr(input.gallery, 24).map((g) => ({ url: s(g?.url, 500), alt: s(g?.alt, 200) })).filter((g) => g.url)
  if (gallery.some((g) => !localOrHttp(g.url))) e.gallery = 'Every gallery image needs a valid URL.'
  const client = { name: s(input.client?.name, 120), url: s(input.client?.url, 300) }
  if (client.url && !/^https?:\/\//.test(client.url)) e.clientUrl = 'Client URL must start with http:// or https://'
  const completedAt = s(input.completedAt, 10)
  if (completedAt && !/^\d{4}-\d{2}-\d{2}$/.test(completedAt)) e.completedAt = 'Use the format YYYY-MM-DD.'
  if (Object.keys(e).length) return { errors: e }
  return { doc: {
    slug, name, url, image, type: s(input.type, 80), summary: s(input.summary, 1000),
    tags: arr(input.tags, 30).map((t) => s(t, 40)).filter(Boolean),
    status: input.status === 'draft' ? 'draft' : 'published',
    overview: s(input.overview, 5000),
    objectives: arr(input.objectives, 20).map((t) => s(t, 300)).filter(Boolean),
    challenge: { title: s(input.challenge?.title, 120) || 'The challenge', body: s(input.challenge?.body, 5000) },
    approach: arr(input.approach, 20).map((a) => ({ heading: s(a?.heading, 120), description: s(a?.description, 1000) })).filter((a) => a.heading || a.description),
    deliverables: arr(input.deliverables, 30).map((d) => ({ text: s(d?.text, 300), icon: ICONS.includes(d?.icon) ? d.icon : 'check' })).filter((d) => d.text),
    gallery, client, completedAt,
  } }
}
