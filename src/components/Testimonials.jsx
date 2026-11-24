import Section from './Section'
import { useSite } from '../lib/site'

export default function Testimonials() {
  const { testimonials } = useSite()
  if (!testimonials.length) return null
  return (
    <Section id="testimonials" title="What clients say">
      <div className="grid gap-6 md:grid-cols-2" data-stagger>
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-line bg-card p-8">
            <blockquote className="text-lg leading-relaxed text-heading">“{t.quote}”</blockquote>
            <figcaption className="mt-6 text-sm"><span className="font-medium text-heading">{t.name}</span>, {t.role}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
