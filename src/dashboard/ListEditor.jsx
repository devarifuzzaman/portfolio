import { useState } from 'react'
import { uploadImage } from '../lib/upload'

export const field = 'w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-heading focus:border-accent-text focus:outline-none'
export const newKey = () => Math.random().toString(36).slice(2)
export const withKeys = (a = []) => a.map((x) => ({ ...x, _k: newKey() }))

// Add, edit, delete and reorder a list of items. Step numbers are generated from the order.
export default function ListEditor({ label, items, onChange, blank, render, addLabel, numbered }) {
  const set = (i, v) => onChange(items.map((x, k) => (k === i ? { ...v, _k: x._k } : x)))
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= items.length) return; const c = [...items];[c[i], c[j]] = [c[j], c[i]]; onChange(c) }
  const btn = 'grid h-7 w-7 place-items-center rounded-md border border-line text-xs text-heading transition-colors hover:border-accent-text disabled:opacity-30'
  return (
    <fieldset className="rounded-xl border border-line p-4">
      <legend className="mono px-2 text-accent-text">{label}</legend>
      {items.length === 0 && <p className="mb-3 text-sm">Nothing added yet.</p>}
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={it._k} className="flex gap-3 rounded-lg border border-line bg-surface p-3">
            {numbered && <span className="mono pt-2.5 text-accent-text" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>}
            <div className="min-w-0 flex-1 space-y-2">{render(it, (v) => set(i, v), i)}</div>
            <div className="flex flex-col gap-1">
              <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${label} item ${i + 1} up`}>↑</button>
              <button type="button" className={btn} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${label} item ${i + 1} down`}>↓</button>
              <button type="button" className={btn} onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label={`Delete ${label} item ${i + 1}`}>✕</button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => onChange([...items, { ...blank(), _k: newKey() }])} className="btn btn-ghost mt-3 !py-1.5">+ {addLabel}</button>
    </fieldset>
  )
}

export function ImageField({ value, onChange, label }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  async function pick(e) {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true); setErr('')
    try { onChange(await uploadImage(file)) } catch (x) { setErr(x.message) }
    setBusy(false); e.target.value = ''
  }
  return (
    <div>
      <div className="flex gap-2">
        <input className={field} aria-label={label} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
        <label className="btn btn-ghost cursor-pointer whitespace-nowrap !px-4 !py-2 focus-within:outline focus-within:outline-2">{busy ? 'Uploading…' : 'Upload'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={pick} disabled={busy} /></label>
      </div>
      {err && <p role="alert" className="mt-1 text-sm text-heading">{err}</p>}
      {value && <img src={value} alt="" className="mt-2 h-20 rounded-lg border border-line object-cover" />}
    </div>
  )
}
