import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import CtaBand from '../components/CtaBand'
import Icon from '../components/Icon'
import { Shot } from '../components/Projects'
import NotFound from './NotFound'
import { useSite } from '../lib/site'
import { usePageMeta, SITE } from '../hooks'
import { trackEvent } from '../lib/analytics'

const paras = (s) => String(s || '').split(/\n{2,}/).map((t) => t.trim()).filter(Boolean)
const fmtDate = (s) => {
  if (!s) return ''
  const d = new Date(s.length === 4 ? `${s}-01-01` : s.length === 7 ? `${s}-01` : s)
  if (isNaN(d)) return s
  return d.toLocaleDateString('en', s.length === 4 ? { year: 'numeric' } : { month: 'long', year: 'numeric' })
}

export default function WorkSingle() {
  const { slug } = useParams()
  const { projects } = useSite()
  const i = projects.findIndex((p) => p.slug === slug)
  const p = projects[i]
  usePageMeta(p?.name, p?.summary, {
    type: 'article',
    jsonLd: p && { '@context': 'https://schema.org', '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Work', item: `${SITE}/work` },
        { '@type': 'ListItem', position: 2, name: p.name, item: `${SITE}/work/${p.slug}` } ] },
      { '@type': 'CreativeWork', name: p.name, description: p.summary, url: p.url, creator: { '@type': 'Person', name: 'MD Arifuzzaman' } } ] },
  })
  if (!p) return <NotFound />

  const title = (k, d) => p.titles?.[k]?.trim() || d
  const overview = paras(p.overview), challenge = paras(p.challenge)
  const related = [...projects.filter((x) => x.slug !== p.slug)]
    .sort((a, b) => (b.tags.filter((t) => p.tags.includes(t)).length + (b.type === p.type)) - (a.tags.filter((t) => p.tags.includes(t)).length + (a.type === p.type)))
    .slice(0, 3)
  const next = projects[(i + 1) % projects.length]

  return (
    <>
      <PageHeader title={p.name} lead={p.summary}>
        <nav aria-label="Breadcrumb" className="mono mb-6"><Link to="/work" className="hover:text-accent-text">← All work</Link></nav>
      </PageHeader>
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-line py-6" data-reveal>
          {p.type && <div><p className="mono">Type</p><p className="text-heading">{p.type}</p></div>}
          {p.client && <div><p className="mono">Client</p><p className="text-heading">{p.client}</p></div>}
          {p.completedAt && <div><p className="mono">Completed</p><p className="text-heading">{fmtDate(p.completedAt)}</p></div>}
          {p.tags.length > 0 && <div><p className="mono">Built with</p><ul className="mt-1 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul></div>}
          {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('outbound_click', { project: p.name, link_url: p.url })} className="btn btn-primary ml-auto">Visit live site<span className="sr-only"> (opens in a new tab)</span><span aria-hidden="true">↗</span></a>}
        </div>
        {p.image && (
          <figure className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_0_80px_-30px_rgb(var(--accent)/0.4)]" data-reveal>
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden="true">
              {[0, 1, 2].map((k) => <span key={k} className="h-2.5 w-2.5 rounded-full bg-line" />)}
              {p.url && <span className="mono ml-3 truncate">{p.url.replace(/^https?:\/\//, '')}</span>}
            </div>
            <Shot p={p} className="aspect-[16/10] w-full object-cover object-top" />
          </figure>
        )}
      </div>

      {(overview.length > 0 || p.objectives.length > 0) && (
        <Section id="overview" title={title('overview', 'Project overview')} className="mt-24 md:mt-32">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5 text-lg leading-relaxed" data-reveal>{overview.map((t, k) => <p key={k}>{t}</p>)}</div>
            {p.objectives.length > 0 && (
              <ul className="space-y-3 self-start rounded-2xl border border-line bg-card/80 p-6" data-stagger aria-label="Project objectives">
                {p.objectives.map((o) => <li key={o} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" /><span className="text-heading">{o}</span></li>)}
              </ul>
            )}
          </div>
        </Section>
      )}

      {challenge.length > 0 && (
        <Section id="challenge" title={title('challenge', 'The challenge')} className={!overview.length && !p.objectives.length ? 'mt-24 md:mt-32' : ''}>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed" data-reveal>{challenge.map((t, k) => <p key={k}>{t}</p>)}</div>
        </Section>
      )}

      {p.approach.length > 0 && (
        <Section id="approach" title={title('approach', 'My approach')}>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2" data-stagger>
            {p.approach.map((a, k) => (
              <li key={k} className="bg-bg p-6 transition-colors hover:bg-surface md:p-8">
                <p className="mono text-accent-text">{String(k + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 text-xl font-semibold">{a.title}</h3>
                {a.text && <p className="mt-2 leading-relaxed">{a.text}</p>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {p.gallery.length > 0 && (
        <Section id="gallery" title={title('gallery', 'Project gallery')}>
          <ul className="grid gap-4 sm:grid-cols-2" data-stagger>
            {p.gallery.map((g, k) => (
              <li key={g.url + k} className={`group overflow-hidden rounded-2xl border border-line bg-surface ${k === 0 && p.gallery.length % 2 ? 'sm:col-span-2' : ''}`}>
                <img src={g.url} alt={g.alt || `${p.name} screenshot ${k + 1}`} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.deliverables.length > 0 && (
        <Section id="outcomes" title={title('deliverables', 'What the project delivered')}>
          <ul className="grid gap-4 md:grid-cols-2" data-stagger>
            {p.deliverables.map((d, k) => (
              <li key={k} className="flex gap-4 rounded-xl border border-line bg-card p-5 text-heading transition-colors hover:border-accent-text">
                {d.icon ? <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-on-accent"><Icon name={d.icon} /></span> : <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-accent" aria-hidden="true" />}
                <span className="self-center">{d.text}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.tags.length > 0 && (
        <Section id="technologies" title={title('technologies', 'Technologies used')}>
          <ul className="flex flex-wrap gap-3" data-stagger>{p.tags.map((t) => <li key={t} className="rounded-xl border border-line bg-card px-5 py-3 text-heading transition-colors hover:border-accent-text">{t}</li>)}</ul>
        </Section>
      )}

      {related.length > 0 && (
        <Section id="related" title={title('related', 'Related projects')}>
          <ul className="grid gap-6 md:grid-cols-3" data-stagger>
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/work/${r.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-accent-text">
                  <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface"><Shot p={r} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]" /></div>
                  <div className="p-5"><p className="mono">{r.type}</p><h3 className="mt-1 text-xl font-semibold group-hover:text-accent-text">{r.name}</h3></div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {next && next.slug !== p.slug && (
        <section aria-label="Next project" className="border-t border-line">
          <Link to={`/work/${next.slug}`} className="group wrap flex items-center justify-between gap-6 py-16">
            <span><span className="mono block">Next project</span><span className="mt-2 block font-display text-3xl font-semibold text-heading transition-colors group-hover:text-accent-text md:text-5xl">{next.name}</span></span>
            <span aria-hidden="true" className="text-4xl text-accent-text transition-transform group-hover:translate-x-2">→</span>
          </Link>
        </section>
      )}
      <CtaBand title="Want a similar result?" />
    </>
  )
}
