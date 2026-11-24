import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { field } from './ListEditor'

const SECTIONS = [
  ['hero', 'Hero (status, headline, rotating roles, intro)'], ['about', 'About (title, paragraphs)'], ['strengths', 'About strengths'],
  ['profile', 'Profile, email and social links'], ['settings', 'Website settings and navigation'], ['stats', 'Achievements and statistics'],
  ['specSheet', 'Hero profile panel'], ['marquee', 'Technology marquee'], ['services', 'Services'], ['process', 'Services process'], ['faqs', 'FAQs'],
  ['skills', 'Skills'], ['experience', 'Work experience'], ['education', 'Education'], ['certifications', 'Certifications'], ['testimonials', 'Testimonials'],
]

// Edit any website section stored in MongoDB as validated JSON.
export default function ContentPanel() {
  const [content, setContent] = useState(null), [key, setKey] = useState('hero'), [text, setText] = useState(''), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { api('/api/content').then((r) => setContent(r.content)).catch((e) => setMsg(e.message)) }, [])
  useEffect(() => { if (content) setText(content[key] === undefined ? '' : JSON.stringify(content[key], null, 2)); setMsg('') }, [key, content])

  async function save() {
    let data
    try { data = JSON.parse(text) } catch (e) { return setMsg(`Not valid JSON: ${e.message}`) }
    setBusy(true); setMsg('')
    try { const r = await api(`/api/content?key=${key}`, { method: 'PUT', body: { data } }); setContent({ ...content, [key]: r.data }); setMsg('Saved to MongoDB.') } catch (e) { setMsg(e.message) }
    setBusy(false)
  }
  if (!content) return <p className="mono">{msg || 'Loading…'}</p>
  const missing = content[key] === undefined
  return (
    <div className="max-w-3xl space-y-4">
      <label className="block text-sm text-heading">Section
        <select className={`${field} mt-1`} value={key} onChange={(e) => setKey(e.target.value)}>{SECTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </label>
      {missing && <p className="text-sm">This section isn't in the database yet. Run <code className="mono">npm run seed</code>, or paste JSON below to create it.</p>}
      <textarea aria-label="Section JSON" spellCheck="false" rows="22" value={text} onChange={(e) => setText(e.target.value)} className={`${field} font-mono text-xs leading-relaxed`} />
      <div className="flex items-center gap-4"><button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Save section'}</button><p role="status" aria-live="polite" className="text-sm text-heading">{msg}</p></div>
    </div>
  )
}
