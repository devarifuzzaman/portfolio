import { useState } from 'react'
import { useSite } from '../lib/site'
import { trackEvent } from '../lib/analytics'
import { RECAPTCHA_KEY, loadRecaptcha, getRecaptchaToken } from '../lib/recaptcha'

const KEY = import.meta.env.VITE_WEB3FORMS_KEY
const field = 'w-full rounded-xl border border-line bg-surface px-4 py-3 text-heading placeholder:text-body/60 transition-colors focus:border-accent-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text/40'

export default function Contact() {
  const { profile } = useSite()
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const socials = profile.socials.filter((s) => s.href)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form))
    if (d.botcheck) return
    setStatus('sending'); setErrMsg('')

    // 1. Save the message. The server checks reCAPTCHA first and rejects bots.
    let blocked = ''
    try {
      const recaptchaToken = await getRecaptchaToken('contact')
      const r = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, email: d.email, type: d.type, message: d.message, botcheck: d.botcheck || '', recaptchaToken }) })
      if ([403, 422, 429].includes(r.status)) blocked = (await r.json().catch(() => ({}))).error || 'Your message could not be sent.'
    } catch (err) {
      if (String(err.message).includes('reCAPTCHA')) blocked = `The spam check could not load. Please turn off any blocker and try again${profile.email ? `, or email ${profile.email}` : ''}.`
    }
    if (blocked) { setErrMsg(blocked); setStatus('error'); return }

    // 2. Deliver by email.
    if (!KEY) {
      const body = `${d.message}\n\n${d.name} (${d.email})`
      setStatus('idle')
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Project enquiry: ' + d.type)}&body=${encodeURIComponent(body)}`
      return
    }
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: KEY, subject: `Project enquiry from ${d.name}`, name: d.name, email: d.email, project_type: d.type, message: d.message }),
      })
      const j = await r.json()
      if (j.success) { setStatus('sent'); trackEvent('generate_lead', { method: 'contact_form', project_type: d.type }); form.reset() } else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div className="wrap pb-28">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} onFocusCapture={() => loadRecaptcha().catch(() => {})} className="space-y-5" data-reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-heading">Name<input required name="name" autoComplete="name" className={`${field} mt-2`} placeholder="Your name" /></label>
            <label className="block text-sm text-heading">Email<input required type="email" name="email" autoComplete="email" className={`${field} mt-2`} placeholder="you@company.com" /></label>
          </div>
          <label className="block text-sm text-heading">Project type
            <select name="type" className={`${field} mt-2`} defaultValue="WordPress website">
              {['WordPress website', 'WooCommerce store', 'Shopify store', 'Custom plugin or theme', 'Technical SEO or speed', 'Something else'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block text-sm text-heading">Project details<textarea required name="message" rows="6" className={`${field} mt-2 resize-y`} placeholder="What do you need, and by when?" /></label>
          <input type="text" name="botcheck" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary disabled:opacity-60">{status === 'sending' ? 'Sending…' : 'Send message'}</button>
            <p role="status" aria-live="polite" className="text-sm">
              {status === 'sent' && <span className="text-accent-text">Message sent. I’ll reply soon.</span>}
              {status === 'error' && <span className="text-heading">{errMsg || <>Couldn’t send. Please try again{profile.email && <> or email {profile.email}</>}.</>}</span>}
            </p>
          </div>
        {RECAPTCHA_KEY && <p className="text-xs">This form is protected by reCAPTCHA. The Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a> apply.</p>}
        </form>
        <div className="space-y-8 lg:pl-8" data-reveal>
          {profile.email && <div><p className="mono mb-2">Email</p><a className="font-display text-xl text-heading hover:text-accent-text" href={`mailto:${profile.email}`}>{profile.email}</a></div>}
          {socials.length > 0 && <div><p className="mono mb-3">Find me on</p>
            <ul className="flex flex-wrap gap-2">{socials.map((s) => <li key={s.label}><a className="chip inline-block hover:border-accent-text hover:text-accent-text" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></div>}
          <p className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed">Working with a client or agency abroad? Remote collaboration across time zones is how I’ve worked for most of my career.</p>
        </div>
      </div>
    </div>
  )
}
