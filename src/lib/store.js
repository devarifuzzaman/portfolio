import { useEffect, useState } from 'react'

// Browser-only helpers for small UI state (cookie consent, launch checklist). Site data lives in MongoDB.
export const KEYS = { checklist: 'dash:checklist' }
export const read = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? f } catch { return f } }
export const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
export function useStored(key, fallback) {
  const [v, setV] = useState(() => read(key, fallback))
  useEffect(() => { write(key, v) }, [key, v])
  return [v, setV]
}
