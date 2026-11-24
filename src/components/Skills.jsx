import Section from './Section'
import { useSite } from '../lib/site'

export default function Skills() {
  const { skills } = useSite()
  return (
    <Section id="skills" title="Tools I use every day" lead="A broad stack, so each project gets the simplest approach that does the job properly.">
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2" data-stagger>
        {skills.map((g) => (
          <div key={g.group}>
            <h3 className="mono mb-4 border-b border-line pb-3 text-sm text-accent-text">{g.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((i) => <li key={i} className="rounded-xl border border-line bg-card px-4 py-2 text-sm text-heading transition-colors hover:border-accent-text">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
