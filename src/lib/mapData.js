// Maps the static data.js exports to the MongoDB shape. Used by `npm run seed` and as the offline fallback.
export function buildContent(d) {
  const approach = (d.approach || []).map((a) => ({ title: a.title, text: a.text }))
  const deliverables = (d.outcomes || []).map((text) => ({ text, icon: 'check' }))
  const projects = (d.projects || []).map((p) => ({
    slug: p.slug, name: p.name, url: p.url, image: p.image, type: p.type, summary: p.summary,
    tags: p.tags || [], status: p.status || 'published',
    overview: '', objectives: [], challenge: d.caseStudies?.[p.slug] || '', titles: {},
    approach, deliverables, gallery: [], client: '', completedAt: '',
  }))
  const content = {
    profile: d.profile, hero: d.hero, about: d.about, marquee: d.marquee,
    settings: { ...d.settings, nav: d.nav },
    stats: d.stats, specSheet: d.specSheet, services: d.services, skills: d.skills, experience: d.experience,
    education: d.education || [], certifications: d.certifications || [], testimonials: d.testimonials || [],
    strengths: d.strengths, process: d.process, faqs: d.faqs,
  }
  return { content, projects }
}
