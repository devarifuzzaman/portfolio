import { useState } from 'react'
import { Link } from 'react-router-dom'
import Section from './Section'
import Tilt from './Tilt'
import MoreLink from './MoreLink'
import { useSite } from '../lib/site'

export function Shot({ p, className = '' }) {
  const [failed, setFailed] = useState(false)
  return failed
    ? <div className={`grid place-items-center font-display text-3xl text-heading ${className}`}>{p.name}</div>
    : <img src={p.image} alt={`${p.name} website homepage screenshot`} width="1200" height="750" loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} />
}

function Card({ p, featured }) {
  return (
    <Tilt max={4} className={`rounded-2xl [&>article]:h-full ${featured ? 'md:col-span-2' : ''}`}>
      <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card/90 transition-colors duration-300 hover:border-accent-text hover:shadow-[0_0_40px_-12px_rgb(var(--accent)/0.5)] ${featured ? 'md:grid md:grid-cols-[1.3fr_1fr]' : ''}`}>
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface md:border-b-0">
          <Shot p={p} className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/3 -translate-y-full bg-gradient-to-b from-transparent via-accent/25 to-transparent transition-transform duration-700 group-hover:translate-y-[300%]" />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <p className="mono">{p.type}</p>
            <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{p.name}</h3>
            <p className="mt-3 leading-relaxed">{p.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">{p.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
          </div>
          <Link to={`/work/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-heading after:absolute after:inset-0 after:content-[''] hover:text-accent-text">
            View case study<span className="sr-only"> for {p.name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </article>
    </Tilt>
  )
}

export function ProjectGrid({ limit }) {
  const { projects } = useSite()
  const list = limit ? projects.slice(0, limit) : projects
  return <div className="grid gap-6 md:grid-cols-2" data-stagger>{list.map((p, i) => <Card key={p.slug} p={p} featured={i === 0} />)}</div>
}

export default function Projects({ limit, more }) {
  return (
    <Section id="work" title="Selected work" lead="Live websites I’ve built or improved for clients in different industries and countries.">
      <ProjectGrid limit={limit} />
      {more && <MoreLink to={more.to}>{more.label}</MoreLink>}
    </Section>
  )
}
