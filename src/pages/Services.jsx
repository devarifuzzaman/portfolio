import PageHeader from '../components/PageHeader'
import ServicesList from '../components/Services'
import Section from '../components/Section'
import CtaBand from '../components/CtaBand'
import { useSite } from '../lib/site'
import { usePageMeta } from '../hooks'

export default function Services() {
  const { process, faqs } = useSite()
  usePageMeta('Services', 'WordPress, Elementor, WooCommerce, Shopify, custom plugin development and Technical SEO services.')
  return (
    <>
      <PageHeader title="Services" lead="Everything from a clean business website to a custom WooCommerce build, with performance and SEO built in." />
      <ServicesList title="What I offer" />
      <Section id="process" title="How we’ll work together">
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {process.map((p, i) => (
            <li key={p.title} className="bg-bg p-6 transition-colors hover:bg-surface">
              <p className="mono text-accent-text">0{i + 1}</p>
              <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{p.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="faq" title="Common questions">
        <div className="max-w-3xl divide-y divide-line border-y border-line" data-reveal>
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-heading [&::-webkit-details-marker]:hidden">
                {f.q}<span aria-hidden="true" className="text-accent-text transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
