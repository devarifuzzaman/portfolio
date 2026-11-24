import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks'

const CH = '!<>-_/[]{}=+*^?#01'
export default function Scramble({ text, as: Tag = 'span', trigger = 'mount', delay = 0, duration = 900, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let raf, io
    const frame = (t0) => (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / duration)), n = Math.floor(p * text.length)
      el.textContent = text.slice(0, n) + text.slice(n).replace(/\S/g, () => CH[(Math.random() * CH.length) | 0])
      if (p < 1) raf = requestAnimationFrame(frame(t0)); else el.textContent = text
    }
    const run = () => { raf = requestAnimationFrame(frame(performance.now() + delay)) }
    if (trigger === 'mount') run()
    else {
      el.textContent = text.replace(/\S/g, () => CH[(Math.random() * CH.length) | 0])
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.6 })
      io.observe(el)
    }
    return () => { cancelAnimationFrame(raf); io?.disconnect(); el.textContent = text }
  }, [text, trigger, delay, duration])
  return <Tag className={className}><span ref={ref} aria-hidden="true">{text}</span><span className="sr-only">{text}</span></Tag>
}
