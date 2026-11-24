import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../hooks'
import { useSite } from '../lib/site'
import { Link } from 'react-router-dom'
import Scramble from './Scramble'
import Tilt from './Tilt'
import Magnetic from './Magnetic'
import Portrait from './Portrait'


export default function Hero() {
  const { specSheet, hero } = useSite()
  const headline = hero.headline || ''
  const roles = hero.roles?.length ? hero.roles : ['']
  const root = useRef(null)
  const [i, setI] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2600)
    return () => clearInterval(t)
  }, [])
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-word', { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07 })
        .from('.hero-portrait', { yPercent: 105, duration: 1.3 }, 0.35)
        .from('.hero-fade', { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('.hero-row', { x: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.7')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="flex min-h-[100svh] items-center pb-20 pt-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="hero-fade mono mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 backdrop-blur">
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--accent))]" aria-hidden="true" /> Available for new projects
          </p>
          <h1 id="hero-title" className="text-[clamp(2.2rem,5.2vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight">
            {headline.split(' ').map((w, k) => (
              <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom"><span className="hero-word inline-block origin-left">{w}</span></span>
            ))}
          </h1>
          <p className="hero-fade mono mt-6 text-sm" aria-hidden="true">
            <span className="text-accent-text">&gt;</span> Now building: <Scramble key={i} text={roles[i]} className="text-heading font-semibold" duration={600} /><span className="caret" />
          </p>
          <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed">
            I’m MD Arifuzzaman, a WordPress developer with 5+ years of experience building Websites,Theme Customization, WooCommerce and Shopify stores,Speed Optimization and technically sound SEO for clients around the world.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap gap-3">
            <Magnetic><Link to="/contact" className="btn btn-primary">Start a project</Link></Magnetic>
            <Magnetic><Link to="/work" className="btn btn-ghost">See selected work</Link></Magnetic>
          </div>
        </div>
        
        <div>

        
        <Tilt max={7} className="rounded-2xl">
          <aside aria-label="At a glance" className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 p-2 shadow-[0_0_60px_-20px_rgb(var(--accent)/0.35)] backdrop-blur">
            <div className="scan-line z-10" aria-hidden="true" />
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden="true">
              {[0, 1, 2].map((k) => <span key={k} className="h-2.5 w-2.5 rounded-full bg-line" />)}
              <span className="mono ml-3">arifuzzaman.profile</span>
            </div>
            <Portrait priority imgClass="hero-portrait" className="h-72 pt-2 border-b border-line sm:h-80" />
            <dl className="divide-y divide-line">
              {specSheet.map(([k, v], n) => (
                <div key={k} className="hero-row grid grid-cols-[6.5rem_1fr] gap-4 px-4 py-4">
                  <dt className="mono pt-0.5 text-accent-text">{k}</dt>
                  <dd className="text-sm text-heading"><Scramble text={v} delay={900 + n * 180} duration={700} /></dd>
                </div>
              ))}
            </dl>
          </aside>
        </Tilt>
        </div>
      </div>
    </section>
  )
}
