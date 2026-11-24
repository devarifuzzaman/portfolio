import { motion } from 'framer-motion'

export function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d[1]))
  return (
    <ul className="space-y-3">
      {data.map(([l, n]) => (
        <li key={l}>
          <div className="mb-1 flex justify-between text-sm"><span className="text-heading">{l}</span><span className="mono">{n}</span></div>
          <div className="h-2 rounded-full bg-line"><motion.div initial={{ width: 0 }} animate={{ width: `${(n / max) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-2 rounded-full bg-accent" /></div>
        </li>
      ))}
    </ul>
  )
}

export function Donut({ data }) {
  const total = data.reduce((a, d) => a + d[1], 0) || 1, C = 2 * Math.PI * 40
  let acc = 0
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90" role="img" aria-label={data.map((d) => `${d[0]}: ${d[1]}`).join(', ')}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(var(--line))" strokeWidth="12" />
        {data.map(([l, n], i) => {
          const len = (n / total) * C, off = -acc; acc += len
          return <motion.circle key={l} cx="50" cy="50" r="40" fill="none" stroke="rgb(var(--accent))" strokeOpacity={1 - i * 0.22} strokeWidth="12" strokeDashoffset={off}
            initial={{ strokeDasharray: `0 ${C}` }} animate={{ strokeDasharray: `${Math.max(len - 1, 0)} ${C}` }} transition={{ duration: 0.9, delay: i * 0.1 }} />
        })}
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map(([l, n], i) => <li key={l} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-accent" style={{ opacity: 1 - i * 0.22 }} aria-hidden="true" /><span className="text-heading">{l}</span><span className="mono">{n}</span></li>)}
      </ul>
    </div>
  )
}

export function Ring({ value }) {
  const C = 2 * Math.PI * 42
  return (
    <div className="relative h-28 w-28" role="img" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--line))" strokeWidth="8" />
        <motion.circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - value / 100) }} transition={{ duration: 1 }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-2xl text-heading">{value}%</span>
    </div>
  )
}
