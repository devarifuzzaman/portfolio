import Section from './Section'
import MoreLink from './MoreLink'
import { useSite } from '../lib/site'

export default function Experience({ compact, more }) {
  const { experience } = useSite()
  return (
    <Section id="experience" title="Professional experience" lead="Agency and remote roles across Bangladesh and the USA, building websites for clients around the world.">
      <ol className="border-t border-line" data-stagger>
        {experience.map((e) => (
          <li key={e.company} className="group grid gap-6 border-b border-line py-10 transition-colors hover:bg-surface md:grid-cols-[14rem_1fr] md:gap-12 md:px-4">
            <div>
              <p className="mono text-accent-text">{e.period}</p>
              <p className="mono mt-1">{e.location}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{e.role}</h3>
              <p className="mt-1">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-heading underline decoration-line underline-offset-4 transition-colors hover:text-accent-text hover:decoration-accent-text">
                  {e.company}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
                </a>
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed">{e.summary}</p>
              {!compact && (
                <ul className="mt-5 max-w-2xl space-y-2">
                  {e.points.map((p) => <li key={p} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" /><span>{p}</span></li>)}
                </ul>
              )}
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools used">{e.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
      {more && <MoreLink to={more.to}>{more.label}</MoreLink>}
    </Section>
  )
}
