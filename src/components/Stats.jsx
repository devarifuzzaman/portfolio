import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../hooks'
import { useSite } from '../lib/site'

export default function Stats() {
  const { stats } = useSite()
  const root = useRef(null)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 }
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () =>
          gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v) } }) })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-label="Achievements" className="border-t border-line">
      <dl className="wrap grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="px-0 py-10 sm:px-8 sm:first:pl-0">
            <dd className="font-display text-5xl font-semibold tracking-tight text-heading md:text-6xl">
              {s.text ? <span className="text-3xl md:text-4xl">{s.text}</span> : <><span data-count={s.value}>{s.value}</span><span className="text-accent-text">{s.suffix}</span></>}
            </dd>
            <dt className="mt-3 text-sm">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
