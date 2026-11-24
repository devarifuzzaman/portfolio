import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { prefersReducedMotion } from '../hooks'

export default function Tilt({ children, className = '', max = 6 }) {
  const x = useMotionValue(0.5), y = useMotionValue(0.5)
  const sx = useSpring(x, { stiffness: 180, damping: 20 }), sy = useSpring(y, { stiffness: 180, damping: 20 })
  const rx = useTransform(sy, [0, 1], [max, -max]), ry = useTransform(sx, [0, 1], [-max, max])
  const gx = useTransform(x, (v) => v * 100 + '%'), gy = useTransform(y, (v) => v * 100 + '%')
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgb(var(--accent) / 0.16), transparent 60%)`
  const move = (e) => {
    if (prefersReducedMotion() || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width); y.set((e.clientY - r.top) / r.height)
  }
  const leave = () => { x.set(0.5); y.set(0.5) }
  return (
    <motion.div onPointerMove={move} onPointerLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }} className={`group/tilt relative ${className}`}>
      {children}
      <motion.div aria-hidden="true" style={{ background: glow }} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100" />
    </motion.div>
  )
}
