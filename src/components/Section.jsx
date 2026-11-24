import Scramble from './Scramble'

export default function Section({ id, title, lead, children, className = '' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 border-t border-line py-24 md:py-32 ${className}`}>
      <div className="wrap">
        <header className="mb-14 max-w-2xl" data-reveal>
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight md:text-5xl"><Scramble text={title} trigger="view" duration={1000} /></h2>
          {lead && <p className="mt-5 text-lg leading-relaxed">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
