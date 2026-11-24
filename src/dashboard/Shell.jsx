import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'
import Overview from './Overview'
import ProjectsPanel from './ProjectsPanel'
import ContentPanel from './ContentPanel'
import Inquiries from './Inquiries'
import Checklist, { total } from './Checklist'
import { useStored, KEYS } from '../lib/store'
import { api } from '../lib/api'

const tabs = [['overview', 'Overview'], ['projects', 'Projects'], ['content', 'Site content'], ['inquiries', 'Inquiries'], ['checklist', 'Launch checklist']]

export default function Shell({ onLogout }) {
  const [tab, setTab] = useState('overview')
  const [projects, setProjects] = useState(null)
  const [inquiries, setInquiries] = useState(null)
  const [error, setError] = useState('')
  const [done, setDone] = useStored(KEYS.checklist, [])
  const progress = Math.round((done.length / total) * 100)

  const loadProjects = useCallback(async () => setProjects((await api('/api/projects?all=1')).projects), [])
  const loadInquiries = useCallback(async () => setInquiries((await api('/api/inquiries')).inquiries), [])
  useEffect(() => { Promise.all([loadProjects(), loadInquiries()]).then(() => setError('')).catch((e) => { setError(e.message); if (e.status === 401) onLogout() }) }, [loadProjects, loadInquiries, onLogout])

  const onStatus = async (id, status) => { setInquiries((l) => l.map((i) => (i.id === id ? { ...i, status } : i))); await api(`/api/inquiries?id=${id}`, { method: 'PATCH', body: { status } }).catch(loadInquiries) }
  const onDelete = async (id) => { await api(`/api/inquiries?id=${id}`, { method: 'DELETE' }); await loadInquiries() }
  const newCount = (inquiries || []).filter((i) => i.status === 'new').length
  const ready = projects && inquiries

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[15rem_1fr]">
        <aside className="border-b border-line p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-6">
          <Link to="/" className="font-display text-lg font-semibold text-heading">MD Arifuzzaman<span className="text-accent-text">.</span></Link>
          <p className="mono mt-1">Project dashboard</p>
          <nav aria-label="Dashboard" className="-mx-1 mt-4 flex gap-1 overflow-x-auto lg:mt-10 lg:flex-col">
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
                className={`relative flex shrink-0 items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${tab === id ? 'text-heading' : 'hover:text-heading'}`}>
                {tab === id && <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-xl border border-line bg-card" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{label}</span>
                {id === 'inquiries' && newCount > 0 && <span className="relative ml-3 rounded-full bg-accent px-2 text-xs font-medium text-on-accent">{newCount}</span>}
              </button>
            ))}
          </nav>
        </aside>
        <main id="main" className="min-w-0 p-4 sm:p-6 lg:p-10">
          <header className="mb-8 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{tabs.find((t) => t[0] === tab)[1]}</h1>
            <div className="flex items-center gap-3"><Link target="_blank" to="/" className="btn btn-ghost !py-2">View site</Link><ThemeToggle /><button onClick={onLogout} className="btn btn-ghost !py-2">Log out</button></div>
          </header>
          {error && <p role="alert" className="mb-6 rounded-xl border border-accent-text p-4 text-sm text-heading">{error}</p>}
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {tab === 'content' && <ContentPanel />}
            {tab === 'checklist' && <Checklist done={done} setDone={setDone} progress={progress} />}
            {!ready && !['content', 'checklist'].includes(tab) && !error && <p className="mono">Loading from MongoDB…</p>}
            {ready && tab === 'overview' && <Overview projects={projects} inquiries={inquiries} progress={progress} go={setTab} />}
            {ready && tab === 'projects' && <ProjectsPanel projects={projects} reload={loadProjects} />}
            {ready && tab === 'inquiries' && <Inquiries inquiries={inquiries} onStatus={onStatus} onDelete={onDelete} />}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
