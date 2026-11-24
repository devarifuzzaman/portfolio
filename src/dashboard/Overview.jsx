import { Bars, Donut, Ring } from './Charts'
import { useSite } from '../lib/site'

const Panel = ({ title, children, className = '' }) => (
  <section className={`rounded-2xl border border-line bg-card/80 p-5 md:p-6 ${className}`}><h2 className="mono mb-5 text-sm text-accent-text">{title}</h2>{children}</section>
)

export default function Overview({ projects, inquiries, progress, go }) {
  const { services } = useSite()
  const pub = projects.filter((p) => p.status !== 'draft').length
  const fresh = inquiries.filter((i) => i.status === 'new').length
  const count = (f) => Object.entries(projects.flatMap(f).reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1])
  const tags = count((p) => p.tags).slice(0, 6), types = count((p) => [p.type]).slice(0, 4)
  const kpis = [
    ['Projects', pub, `${projects.length - pub} drafts`, 'projects'],
    ['New inquiries', fresh, `${inquiries.length} total`, 'inquiries'],
    ['Services', services.length, 'listed on site', null],
    ['Launch checklist', progress + '%', 'complete', 'checklist'],
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-kpis>
        {kpis.map(([l, v, sub, to]) => (
          <button key={l} type="button" disabled={!to} onClick={() => to && go(to)} className="rounded-2xl border border-line bg-card/80 p-5 text-left transition-colors enabled:hover:border-accent-text">
            <p className="mono">{l}</p><p className="mt-3 font-display text-4xl font-semibold text-heading">{v}</p><p className="mt-1 text-sm">{sub}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Tools across projects">{tags.length ? <Bars data={tags} /> : <p>No projects yet.</p>}</Panel>
        <Panel title="Projects by type">{types.length ? <Donut data={types} /> : <p>No projects yet.</p>}</Panel>
        <Panel title="Latest inquiries">
          {inquiries.length === 0 ? <p className="text-sm">Messages sent through the contact form appear here.</p> : (
            <ul className="divide-y divide-line">
              {inquiries.slice(0, 4).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span><span className="text-heading">{i.name}</span> <span className="mono">· {i.type}</span></span>
                  <span className={`chip ${i.status === 'new' ? 'border-accent-text text-accent-text' : ''}`}>{i.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Launch readiness"><div className="flex items-center gap-6"><Ring value={progress} /><p className="text-sm leading-relaxed">Work through the checklist to replace placeholder content and verify performance, accessibility and SEO before going live.</p></div></Panel>
      </div>
    </div>
  )
}
