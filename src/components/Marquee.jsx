import { useSite } from '../lib/site'
function Row({ items, rev }) {
  const list = [...items, ...items]
  return (
    <div className="marquee overflow-hidden py-3" role="presentation">
      <div className={`marquee-track ${rev ? 'rev' : ''}`} aria-hidden="true">
        {list.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className={`px-6 font-display text-4xl font-semibold md:text-6xl ${i % 2 ? 'outline-text' : 'text-heading'}`}>{t}</span>
            <span className="h-2 w-2 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  const rows = useSite().marquee?.rows || []
  if (!rows.length) return null
  return (
    <section aria-label="Technologies I work with" className="overflow-hidden border-t border-line py-10">
      <p className="sr-only">{rows.flat().join(', ')}</p>
      {rows.slice(0, 2).map((r, i) => <Row key={i} items={r} rev={i === 1} />)}
    </section>
  )
}
