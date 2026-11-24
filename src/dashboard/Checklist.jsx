import { Ring } from './Charts'

export const groups = [
  ['Content', ['Replace placeholder project descriptions', 'Write real case study details and results', 'Add your email and social links in data.js', 'Add testimonials from clients', 'Review the experience descriptions in data.js']],
  ['Performance', ['Replace mShots with your own optimised screenshots (WebP)', 'Run Lighthouse and score 90+ on mobile', 'Confirm fonts load with a fallback stack']],
  ['Accessibility', ['Tab through every page using only the keyboard', 'Check colour contrast in dark and light themes', 'Test with a screen reader', 'Test with reduced motion enabled']],
  ['SEO and launch', ['Add a Web3Forms key and send a test message', 'Add an Open Graph image', 'Add sitemap.xml and robots.txt', 'Connect your domain and submit it to Search Console']],
]
export const total = groups.reduce((a, g) => a + g[1].length, 0)

export default function Checklist({ done, setDone, progress }) {
  const toggle = (k) => setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]))
  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-5 self-start rounded-2xl border border-line bg-card/80 p-6"><Ring value={progress} /><p className="text-sm">{done.length} of {total} tasks done</p></div>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map(([g, items]) => (
          <fieldset key={g} className="rounded-2xl border border-line bg-card/80 p-5">
            <legend className="mono px-2 text-sm text-accent-text">{g}</legend>
            <ul className="space-y-3">
              {items.map((t) => (
                <li key={t}><label className="flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={done.includes(t)} onChange={() => toggle(t)} className="mt-0.5 h-4 w-4 accent-[rgb(var(--accent))]" /><span className={done.includes(t) ? 'line-through opacity-60' : 'text-heading'}>{t}</span></label></li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
