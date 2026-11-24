import Scramble from './Scramble'

export default function PageHeader({ title, lead, children, aside }) {
  return (
    <header className="wrap pb-16 pt-40 md:pb-20 md:pt-48">
      <div className={aside ? 'grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]' : ''}>
        <div>
          {children}
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl"><Scramble text={title} duration={900} /></h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed" data-reveal>{lead}</p>}
        </div>
        {aside}
      </div>
    </header>
  )
}
