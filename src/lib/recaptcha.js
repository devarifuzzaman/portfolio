export const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const enterprise = import.meta.env.VITE_RECAPTCHA_MODE === 'enterprise'
let loading

// Loads Google's script only when it's needed (when the visitor starts using the contact form).
export function loadRecaptcha() {
  if (!RECAPTCHA_KEY) return Promise.resolve(null)
  if (loading) return loading
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://www.google.com/recaptcha/${enterprise ? 'enterprise' : 'api'}.js?render=${encodeURIComponent(RECAPTCHA_KEY)}`
    s.async = true
    s.onload = () => resolve(enterprise ? window.grecaptcha.enterprise : window.grecaptcha)
    s.onerror = () => { loading = undefined; reject(new Error('reCAPTCHA failed to load')) }
    document.head.appendChild(s)
  })
  return loading
}

export async function getRecaptchaToken(action = 'contact') {
  const g = await loadRecaptcha()
  if (!g) return ''
  await new Promise((r) => g.ready(r))
  return g.execute(RECAPTCHA_KEY, { action })
}
