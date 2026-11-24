import Section from './Section'
import { useSite } from '../lib/site'

export default function About() {
  const { about, strengths } = useSite()
  return (
    <Section id="about" title={about?.title || 'Professional profile'}>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5 text-lg leading-relaxed" data-reveal>
          {(about?.paragraphs || []).map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2" data-stagger>
          {(strengths || []).map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-card/80 p-5 transition-colors hover:border-accent-text">
              <p className="mono text-accent-text">0{i + 1}</p>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
