import Section from './Section'
import { useSite } from '../lib/site'

// Education and certifications. Hidden until you add entries in Dashboard > Site content.
export default function Credentials() {
  const { education = [], certifications = [] } = useSite()
  if (!education.length && !certifications.length) return null
  return (
    <Section id="credentials" title="Education and certifications">
      <div className="grid gap-12 md:grid-cols-2" data-stagger>
        {education.length > 0 && (
          <div>
            <h3 className="mono mb-4 border-b border-line pb-3 text-sm text-accent-text">Education</h3>
            <ul className="space-y-6">{education.map((e, i) => (
              <li key={i}><p className="text-lg font-semibold text-heading">{e.degree}</p><p>{e.school}</p>{e.period && <p className="mono mt-1">{e.period}</p>}{e.note && <p className="mt-2 text-sm">{e.note}</p>}</li>
            ))}</ul>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h3 className="mono mb-4 border-b border-line pb-3 text-sm text-accent-text">Certifications</h3>
            <ul className="space-y-6">{certifications.map((c, i) => (
              <li key={i}>
                <p className="text-lg font-semibold text-heading">{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-text">{c.name} ↗</a> : c.name}</p>
                <p>{[c.issuer, c.year].filter(Boolean).join(' · ')}</p>
              </li>
            ))}</ul>
          </div>
        )}
      </div>
    </Section>
  )
}
