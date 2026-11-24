import { motion } from 'framer-motion'
import { useTheme } from '../hooks'

export default function ThemeToggle() {
  const [theme, toggle] = useTheme()
  const dark = theme === 'dark'
  return (
    <button type="button" onClick={toggle} role="switch" aria-checked={dark} aria-label="Dark theme"
      className="relative h-8 w-14 shrink-0 rounded-full border border-line bg-surface transition-colors hover:border-accent-text">
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-on-accent"
        style={{ left: dark ? 'calc(100% - 1.75rem)' : '0.25rem' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          {dark ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
        </svg>
      </motion.span>
    </button>
  )
}
