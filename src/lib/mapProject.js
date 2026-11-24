// Maps a data.js project (plus its existing case-study content) to the MongoDB project shape.
// Nothing is invented: new fields without source content stay empty.
export function mapProject(p, d = {}) {
  return {
    slug: p.slug, name: p.name, url: p.url || '', image: p.image || '', type: p.type || '', summary: p.summary || '',
    tags: p.tags || [], status: p.status || 'published',
    overview: '', objectives: [],
    challenge: { title: 'The challenge', body: d.caseStudies?.[p.slug] || '' },
    approach: (d.approach || []).map((a) => ({ heading: a.title, description: a.text })),
    deliverables: (d.outcomes || []).map((text) => ({ text, icon: 'check' })),
    gallery: [], client: { name: '', url: '' }, completedAt: '',
  }
}
