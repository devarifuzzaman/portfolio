import { useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../hooks'

export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const move = (e) => {
    if (prefersReducedMotion() || e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.3, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  return <span ref={ref} onPointerMove={move} onPointerLeave={leave} className="inline-block">{children}</span>
}
