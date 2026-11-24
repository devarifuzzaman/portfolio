import { useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReducedMotion } from './hooks'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Backdrop from './components/Backdrop'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Work from './pages/Work'
import WorkSingle from './pages/WorkSingle'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Analytics from './components/Analytics'
import { useSite } from './lib/site'

gsap.registerPlugin(ScrollTrigger)

const ToWork = () => <Navigate to={`/work/${useParams().slug}`} replace />

export default function App() {
  const { pathname } = useLocation()
  const { loading } = useSite()
  const isDash = pathname.startsWith('/dashboard')

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (loading || isDash || prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray('[data-rise]').forEach((el) => {
        gsap.from(el, { yPercent: 105, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el.parentElement, start: 'top 90%', once: true } })
      })
      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.from(group.children, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 85%', once: true } })
      })
    })
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [pathname, loading])

  if (loading) return <div className="grid min-h-screen place-items-center"><span className="pulse-dot h-3 w-3 rounded-full bg-accent" role="status" aria-label="Loading" /></div>
  if (isDash) return <Dashboard />

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Skip to content</a>
      <Backdrop />
      <ScrollProgress />
      <Nav />
      <motion.main id="main" key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkSingle />} />
          <Route path="/projects/:slug" element={<ToWork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
      <Analytics />
    </>
  )
}
