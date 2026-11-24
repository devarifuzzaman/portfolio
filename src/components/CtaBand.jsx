import { Link } from 'react-router-dom'
import Magnetic from './Magnetic'
import Scramble from './Scramble'

export default function CtaBand({ title = 'Have a project in mind?', text = 'Tell me what you need and I’ll reply with a clear next step.' }) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-line py-24 md:py-32">
      <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-3xl font-semibold tracking-tight md:text-5xl"><Scramble text={title} trigger="view" /></h2>
          <p className="mt-4 text-lg">{text}</p>
        </div>
        <Magnetic><Link to="/contact" className="btn btn-primary">Start a project</Link></Magnetic>
      </div>
    </section>
  )
}
