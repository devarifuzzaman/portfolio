import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121212' : '#F8FAF5')
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const SITE = (import.meta.env.VITE_SITE_URL || 'https://devarifuzzaman.vercel.app').replace(/\/$/, '')
const DEFAULT_TITLE = 'MD Arifuzzaman | WordPress, WooCommerce & Shopify Developer'
const DEFAULT_DESC = 'Top Rated Plus WordPress developer with 17+ years of experience and 100+ projects. Custom themes, plugins, WooCommerce, Shopify, Elementor and Technical SEO for clients worldwide.'

function setTag(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) { el = document.createElement(selector.startsWith('link') ? 'link' : 'meta'); document.head.appendChild(el) }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

export function usePageMeta(title, desc, opts = {}) {
  const ld = JSON.stringify(opts.jsonLd || null)
  useEffect(() => {
    const full = title ? `${title} | MD Arifuzzaman` : DEFAULT_TITLE
    const d = desc || DEFAULT_DESC
    const url = SITE + (opts.path ?? window.location.pathname)
    const image = SITE + (opts.image || '/og-image.png')
    document.title = full
    setTag('meta[name="description"]', { name: 'description', content: d })
    setTag('link[rel="canonical"]', { rel: 'canonical', href: url })
    setTag('meta[name="robots"]', { name: 'robots', content: opts.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' })
    setTag('meta[property="og:type"]', { property: 'og:type', content: opts.type || 'website' })
    setTag('meta[property="og:title"]', { property: 'og:title', content: full })
    setTag('meta[property="og:description"]', { property: 'og:description', content: d })
    setTag('meta[property="og:url"]', { property: 'og:url', content: url })
    setTag('meta[property="og:image"]', { property: 'og:image', content: image })
    setTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: full })
    setTag('meta[name="twitter:description"]', { name: 'twitter:description', content: d })
    setTag('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    let s = document.getElementById('page-jsonld')
    if (ld !== 'null') {
      if (!s) { s = document.createElement('script'); s.id = 'page-jsonld'; s.type = 'application/ld+json'; document.head.appendChild(s) }
      s.textContent = ld
    } else s?.remove()
  }, [title, desc, opts.noindex, opts.path, opts.type, opts.image, ld])
}
