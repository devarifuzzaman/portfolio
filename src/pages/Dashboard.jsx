import { useEffect, useState } from 'react'
import Login from '../dashboard/Login'
import Shell from '../dashboard/Shell'
import { getSession, logout } from '../lib/auth'
import { usePageMeta } from '../hooks'

export default function Dashboard() {
  usePageMeta('Dashboard', undefined, { noindex: true })
  const [state, setState] = useState('loading')
  useEffect(() => { getSession().then((ok) => setState(ok ? 'in' : 'out')) }, [])
  if (state === 'loading') return <div className="grid min-h-screen place-items-center"><p className="mono">Checking session…</p></div>
  if (state === 'out') return <Login onSuccess={() => setState('in')} />
  return <Shell onLogout={async () => { await logout(); setState('out') }} />
}
