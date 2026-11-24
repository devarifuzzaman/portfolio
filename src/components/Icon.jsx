const P = {
  check: 'M5 13l4 4L19 7',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  speed: 'M12 14l4-5M4 18a9 9 0 1 1 16 0',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5 12 5 5',
  shield: 'M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  device: 'M7 4h10v16H7zM11 17h2',
}
export default function Icon({ name = 'check', className = '' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><path d={P[name] || P.check} /></svg>
}
