import { Link } from 'react-router-dom'
import { useSite } from '../lib/site'
import { ANALYTICS_ENABLED } from '../lib/analytics'

export default function Footer() {
  const { settings, profile } = useSite()
  const nav = settings.nav
  return (
    <footer className="border-t border-line py-12">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-heading">{profile.name}</p>
          <p className="mt-1 text-sm">{profile.role}. WordPress, WooCommerce, Shopify and Technical SEO.</p>
        </div>
        <nav aria-label="Footer"><ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-accent-text">{n.label}</Link></li>)}
          {ANALYTICS_ENABLED && <li><button type="button" onClick={() => window.dispatchEvent(new Event('consent-reset'))} className="hover:text-accent-text">Cookie settings</button></li>}
        </ul></nav>
      </div>
      <p className="wrap mono mt-10">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
    </footer>
  )
}
