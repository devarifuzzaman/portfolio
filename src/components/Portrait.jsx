// Cut-out portrait on a glowing stage. The image is clipped by the stage, so it can slide up from its bottom edge.
export default function Portrait({ priority = false, rise = false, imgClass = '', className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgb(var(--line)/.7) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)/.7) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(circle at 50% 70%, #000 20%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle at 50% 70%, #000 20%, transparent 75%)' }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 90%, rgb(var(--accent)/0.38), transparent 62%)' }} />
      <div aria-hidden="true" className="absolute bottom-[-18%] left-1/2 aspect-square h-[88%] -translate-x-1/2 rounded-full border border-accent/40" />
      <img
        src="/images/arifuzzaman-900.webp"
        srcSet="/images/arifuzzaman-480.webp 480w, /images/arifuzzaman-900.webp 900w"
        sizes="(min-width: 1024px) 420px, 90vw"
        width="900" height="1019"
        alt="MD Arifuzzaman, WordPress and web developer"
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
        data-rise={rise ? '' : undefined}
        className={`relative mx-auto block h-full w-auto max-w-full object-contain object-bottom ${imgClass}`}
      />
    </div>
  )
}
