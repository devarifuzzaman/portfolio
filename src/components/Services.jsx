import Section from './Section'
import MoreLink from './MoreLink'
import { useSite } from '../lib/site'

export default function Services({ more, title = 'What I can build and fix for you' }) {
  const { services } = useSite()
  return (
    <Section id="services" title={title} lead="End-to-end WordPress and eCommerce work, from first wireframe to a fast, search-ready launch.">
      <ul className="border-t border-line" data-stagger>
        {services.map((s) => (
          <li key={s.title} className="group grid gap-4 border-b border-line py-8 transition-colors hover:bg-surface md:grid-cols-[1fr_1.2fr_auto] md:items-start md:gap-10 md:px-4">
            <h3 className="text-xl font-semibold transition-colors group-hover:text-accent-text md:text-2xl">{s.title}</h3>
            <p className="leading-relaxed">{s.text}</p>
            <ul className="flex flex-wrap gap-2 md:max-w-[14rem] md:justify-end" aria-label="Related tools">
              {s.tags.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
          </li>
        ))}
      </ul>
      {more && <MoreLink to={more.to}>{more.label}</MoreLink>}
    </Section>
  )
}
