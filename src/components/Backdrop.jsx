import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks'

export default function Backdrop() {
  const spot = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        spot.current?.style.setProperty('--mx', e.clientX + 'px')
        spot.current?.style.setProperty('--my', e.clientY + 'px')
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="orb -left-24 top-10 h-[34rem] w-[34rem]" />
      <div className="orb -right-32 bottom-0 h-[28rem] w-[28rem]" style={{ animationDelay: '-9s' }} />
      <div ref={spot} className="spot absolute inset-0" />
    </div>
  )
}
