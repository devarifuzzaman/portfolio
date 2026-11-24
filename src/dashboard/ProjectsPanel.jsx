import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { shot } from '../data'
import { api } from '../lib/api'
import ListEditor, { ImageField, field, withKeys, newKey } from './ListEditor'

const ICONS = [['', 'Bullet'], ['check', 'Check'], ['bolt', 'Bolt'], ['speed', 'Speed'], ['seo', 'Search'], ['shield', 'Shield'], ['edit', 'Editing'], ['device', 'Devices']]
const TITLES = [['overview', 'Overview'], ['challenge', 'Challenge'], ['approach', 'Approach'], ['gallery', 'Gallery'], ['deliverables', 'Deliverables'], ['technologies', 'Technologies'], ['related', 'Related projects']]
const Field = ({ label, children }) => <label className="block text-sm text-heading">{label}<div className="mt-1">{children}</div></label>

function Editor({ project, onSave, onClose }) {
  const isNew = !project.slug
  const [f, setF] = useState(() => ({
    name: '', url: '', type: '', summary: '', status: 'published', image: '', overview: '', challenge: '', client: '', completedAt: '', ...project,
    tagsText: (project.tags || []).join(', '), titles: { ...(project.titles || {}) },
    objectives: (project.objectives || []).map((text) => ({ text, _k: newKey() })), approach: withKeys(project.approach), deliverables: withKeys(project.deliverables), gallery: withKeys(project.gallery),
  }))
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null)
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const strip = (a) => a.map(({ _k, ...x }) => x)

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const payload = {
      name: f.name, url: f.url, type: f.type, summary: f.summary, status: f.status, client: f.client, completedAt: f.completedAt, overview: f.overview, challenge: f.challenge, titles: f.titles,
      tags: f.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      image: !f.image || f.image.includes('mshots') ? (f.url ? shot(f.url) : '') : f.image,
      objectives: f.objectives.map((o) => o.text), approach: strip(f.approach), deliverables: strip(f.deliverables), gallery: strip(f.gallery),
    }
    try { await onSave(payload) } catch (x) { setErr(x); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.form role="dialog" aria-modal="true" aria-label={isNew ? 'New project' : 'Edit project'} onSubmit={submit} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl border border-line bg-bg p-6">
        <h2 className="font-display text-2xl font-semibold">{isNew ? 'New project' : `Edit ${project.name}`}</h2>

        <fieldset className="space-y-4 rounded-xl border border-line p-4"><legend className="mono px-2 text-accent-text">Basics</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input required autoFocus className={field} value={f.name} onChange={set('name')} /></Field>
            <Field label="Live URL"><input type="url" className={field} value={f.url} onChange={set('url')} placeholder="https://" /></Field>
            <Field label="Type"><input className={field} value={f.type} onChange={set('type')} placeholder="eCommerce" /></Field>
            <Field label="Status"><select className={field} value={f.status} onChange={set('status')}><option value="published">Published</option><option value="draft">Draft</option></select></Field>
          </div>
          <Field label="Summary"><textarea rows="2" className={field} value={f.summary} onChange={set('summary')} /></Field>
          <Field label="Technologies used (comma separated)"><input className={field} value={f.tagsText} onChange={set('tagsText')} placeholder="WordPress, Elementor" /></Field>
          <Field label="Cover image (leave empty to use an automatic screenshot of the live URL)"><ImageField label="Cover image URL" value={f.image} onChange={(v) => setF({ ...f, image: v })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client (optional)"><input className={field} value={f.client} onChange={set('client')} /></Field>
            <Field label="Completion date (optional, e.g. 2026-03)"><input className={field} value={f.completedAt} onChange={set('completedAt')} placeholder="2026-03" /></Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border border-line p-4"><legend className="mono px-2 text-accent-text">Overview and challenge</legend>
          <Field label="Project overview (blank line = new paragraph)"><textarea rows="5" className={field} value={f.overview} onChange={set('overview')} /></Field>
          <ListEditor label="Objectives" items={f.objectives} onChange={(v) => setF({ ...f, objectives: v })} blank={() => ({ text: '' })} addLabel="Add objective"
            render={(it, up) => <input aria-label="Objective" className={field} value={it.text} onChange={(e) => up({ text: e.target.value })} />} />
          <Field label="Challenge description (blank line = new paragraph)"><textarea rows="5" className={field} value={f.challenge} onChange={set('challenge')} /></Field>
        </fieldset>

        <ListEditor label="Approach steps" numbered items={f.approach} onChange={(v) => setF({ ...f, approach: v })} blank={() => ({ title: '', text: '' })} addLabel="Add step"
          render={(it, up) => (<>
            <input aria-label="Step heading" className={field} placeholder="Heading" value={it.title} onChange={(e) => up({ ...it, title: e.target.value })} />
            <textarea aria-label="Step description" rows="2" className={field} placeholder="Description" value={it.text} onChange={(e) => up({ ...it, text: e.target.value })} />
          </>)} />

        <ListEditor label="Deliverables and results" items={f.deliverables} onChange={(v) => setF({ ...f, deliverables: v })} blank={() => ({ text: '', icon: 'check' })} addLabel="Add deliverable"
          render={(it, up) => (<>
            <textarea aria-label="Deliverable" rows="2" className={field} value={it.text} onChange={(e) => up({ ...it, text: e.target.value })} />
            <select aria-label="Icon" className={`${field} w-auto`} value={it.icon || ''} onChange={(e) => up({ ...it, icon: e.target.value })}>{ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </>)} />

        <ListEditor label="Gallery images" items={f.gallery} onChange={(v) => setF({ ...f, gallery: v })} blank={() => ({ url: '', alt: '' })} addLabel="Add image"
          render={(it, up) => (<>
            <ImageField label="Gallery image URL" value={it.url} onChange={(v) => up({ ...it, url: v })} />
            <input aria-label="Image description (alt text)" className={field} placeholder="Describe the image" value={it.alt} onChange={(e) => up({ ...it, alt: e.target.value })} />
          </>)} />

        <details className="rounded-xl border border-line p-4"><summary className="mono cursor-pointer text-accent-text">Section titles (optional)</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{TITLES.map(([k, l]) => <Field key={k} label={l}><input className={field} value={f.titles[k] || ''} onChange={(e) => setF({ ...f, titles: { ...f.titles, [k]: e.target.value } })} placeholder="Default title" /></Field>)}</div>
        </details>

        {err && <div role="alert" className="rounded-xl border border-accent-text p-4 text-sm text-heading"><p className="font-medium">{err.message}</p>{err.details?.length > 0 && <ul className="mt-2 list-disc pl-5">{err.details.map((d) => <li key={d}>{d}</li>)}</ul>}</div>}
        <div className="sticky bottom-0 flex justify-end gap-3 bg-bg pt-3"><button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button><button disabled={busy} className="btn btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Save project'}</button></div>
      </motion.form>
    </div>
  )
}

export default function ProjectsPanel({ projects, reload }) {
  const [q, setQ] = useState(''), [filter, setFilter] = useState('all'), [edit, setEdit] = useState(null), [msg, setMsg] = useState('')
  const rows = projects.filter((p) => (filter === 'all' || p.status === filter) && (p.name + p.type + (p.tags || []).join()).toLowerCase().includes(q.toLowerCase()))
  const run = async (fn) => { setMsg(''); try { await fn(); await reload() } catch (e) { setMsg(e.message) } }
  const save = async (payload) => { await api(isEditing() ? `/api/projects?slug=${encodeURIComponent(edit.slug)}` : '/api/projects', { method: isEditing() ? 'PUT' : 'POST', body: payload }); await reload(); setEdit(null) }
  const isEditing = () => Boolean(edit?.slug)
  const toggle = (p) => run(() => api(`/api/projects?slug=${encodeURIComponent(p.slug)}`, { method: 'PUT', body: { status: p.status === 'draft' ? 'published' : 'draft' } }))
  const del = (p) => confirm(`Delete ${p.name}? This removes it from the database.`) && run(() => api(`/api/projects?slug=${encodeURIComponent(p.slug)}`, { method: 'DELETE' }))
  const exportJson = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })); a.download = 'projects-backup.json'; a.click() }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input type="search" aria-label="Search projects" placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)} className={`${field} max-w-xs`} />
        <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)} className={`${field} w-auto`}><option value="all">All</option><option value="published">Published</option><option value="draft">Drafts</option></select>
        <div className="ml-auto flex gap-2">
          <button onClick={exportJson} className="btn btn-ghost !py-2">Backup JSON</button>
          <button onClick={() => setEdit({ tags: [], status: 'published' })} className="btn btn-primary !py-2">Add project</button>
        </div>
      </div>
      {msg && <p role="alert" className="mb-4 text-sm text-heading">{msg}</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card/80">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="mono border-b border-line"><tr><th className="p-4 font-normal">Project</th><th className="p-4 font-normal">Tools</th><th className="p-4 font-normal">Status</th><th className="p-4 text-right font-normal">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.slug} className="transition-colors hover:bg-surface">
                <td className="p-4"><p className="font-medium text-heading">{p.name}</p><p className="mono">{p.type} · /work/{p.slug}</p></td>
                <td className="p-4"><div className="flex flex-wrap gap-1.5">{(p.tags || []).map((t) => <span key={t} className="chip">{t}</span>)}</div></td>
                <td className="p-4"><button onClick={() => toggle(p)} aria-label={`${p.name} is ${p.status}. Click to change.`} className={`chip ${p.status !== 'draft' ? 'border-accent-text text-accent-text' : ''}`}>{p.status === 'draft' ? 'draft' : 'published'}</button></td>
                <td className="p-4 text-right"><button onClick={() => setEdit(p)} className="mr-4 text-heading hover:text-accent-text">Edit</button><button onClick={() => del(p)} className="hover:text-heading">Delete</button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="4" className="p-8 text-center">No projects match.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm">Every change is saved to MongoDB and appears on the public site straight away.</p>
      {edit && <Editor project={edit} onSave={save} onClose={() => setEdit(null)} />}
    </div>
  )
}
