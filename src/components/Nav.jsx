import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSite } from '../lib/site'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  const { settings, profile } = useSite()
  const nav = settings.nav
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const isActive = (to) => pathname === to || pathname.startsWith(to + '/')

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${scrolled || open ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent'}`}>
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold text-heading hover:text-accent-text" aria-label={`${profile.name}, home`}>
          MD Arifuzzaman<span className="text-accent-text">.</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} aria-current={isActive(n.to) ? 'page' : undefined}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${isActive(n.to) ? 'text-heading' : 'hover:text-accent-text'}`}>
              {n.label}
              {isActive(n.to) && <motion.span layoutId="nav-indicator" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/contact" className="btn btn-primary hidden !py-2 sm:inline-flex">Hire me</Link>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label="Menu" onClick={() => setOpen(!open)}>
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line md:hidden">
            <ul className="wrap py-4">
              {nav.map((n) => <li key={n.to}><Link to={n.to} className="block py-3 font-display text-xl text-heading">{n.label}</Link></li>)}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
