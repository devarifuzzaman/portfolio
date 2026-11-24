// Google Analytics 4, Google Tag Manager and Meta Pixel. Everything loads only after the visitor accepts cookies.
export const GA_ID = import.meta.env.VITE_GA_ID
export const GTM_ID = import.meta.env.VITE_GTM_ID
export const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID
export const ANALYTICS_ENABLED = Boolean(GA_ID || GTM_ID || PIXEL_ID)

// Site events -> Meta standard events (anything else is sent as a custom event).
const PIXEL_EVENTS = { generate_lead: 'Lead' }
const addScript = (src) => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s) }
let ready = false

function initGTM() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  addScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`)
}
function initGA() {
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true })
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`)
}
function initPixel() {
  if (window.fbq) return
  const n = (window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) })
  if (!window._fbq) window._fbq = n
  n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
  addScript('https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('init', PIXEL_ID) // page views are sent per route by trackPage
}

export function initTracking() {
  if (ready || !ANALYTICS_ENABLED) return
  ready = true
  if (GTM_ID) initGTM()
  else if (GA_ID) initGA() // when GTM is used, configure GA4 as a tag inside GTM to avoid double counting
  if (PIXEL_ID) initPixel()
}

export function trackPage(path, title) {
  if (!ready) return
  if (GTM_ID) window.dataLayer.push({ event: 'page_view', page_path: path, page_title: title, page_location: window.location.href })
  else window.gtag?.('event', 'page_view', { page_path: path, page_title: title, page_location: window.location.href })
  window.fbq?.('track', 'PageView')
}

export function trackEvent(name, params = {}) {
  if (!ready) return
  if (GTM_ID) window.dataLayer.push({ event: name, ...params })
  else window.gtag?.('event', name, params)
  if (PIXEL_ID && window.fbq) {
    if (PIXEL_EVENTS[name]) window.fbq('track', PIXEL_EVENTS[name], params)
    else window.fbq('trackCustom', name, params)
  }
}
