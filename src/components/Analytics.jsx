import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ANALYTICS_ENABLED, initTracking, trackPage } from '../lib/analytics'
import { read, write } from '../lib/store'

export default function Analytics() {
  const { pathname, search } = useLocation()
  const [consent, setConsent] = useState(() => read('consent', null))

  useEffect(() => {
    const reset = () => setConsent(null)
    window.addEventListener('consent-reset', reset)
    return () => window.removeEventListener('consent-reset', reset)
  }, [])
  useEffect(() => { if (consent === 'granted') initTracking() }, [consent])
  useEffect(() => { if (consent === 'granted') trackPage(pathname + search, document.title) }, [pathname, search, consent])

  const choose = (v) => { write('consent', v); setConsent(v) }
  if (!ANALYTICS_ENABLED || consent) return null
  return (
    <section aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 z-[80] max-w-sm rounded-2xl border border-line bg-bg/95 p-5 shadow-2xl backdrop-blur sm:right-auto">
      <p className="text-sm leading-relaxed text-heading">I use analytics and advertising cookies (Google and Meta) to understand which pages are useful and to measure my ads. They only load if you accept.</p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => choose('granted')} className="btn btn-primary !px-5 !py-2">Accept</button>
        <button onClick={() => choose('denied')} className="btn btn-ghost !px-5 !py-2">Decline</button>
      </div>
    </section>
  )
}
