import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../lib/auth'

const field = 'w-full rounded-xl border border-line bg-surface px-4 py-3 text-heading focus:border-accent-text focus:outline-none'

export default function Login({ onSuccess }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true); setError('')
    const r = await login(d.username, d.password)
    setBusy(false)
    if (r.ok) onSuccess(); else setError(r.data?.error || 'Login failed.')
  }
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-5 rounded-2xl border border-line bg-card/90 p-8 backdrop-blur">
        <div><Link to="/" className="font-display text-lg font-semibold text-heading">MD Arifuzzaman<span className="text-accent-text">.</span></Link><h1 className="mt-6 text-3xl font-semibold">Dashboard login</h1></div>
        <label className="block text-sm text-heading">Username<input required name="username" autoComplete="username" autoFocus className={`${field} mt-2`} /></label>
        <label className="block text-sm text-heading">Password<input required type="password" name="password" autoComplete="current-password" className={`${field} mt-2`} /></label>
        <p role="alert" aria-live="assertive" className="min-h-5 text-sm text-heading">{error}</p>
        <button disabled={busy} className="btn btn-primary w-full disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </motion.form>
    </main>
  )
}
