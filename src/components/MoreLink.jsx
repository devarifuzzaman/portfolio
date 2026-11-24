import { Link } from 'react-router-dom'
export default function MoreLink({ to, children }) {
  return <div className="mt-10"><Link to={to} className="btn btn-ghost">{children}<span aria-hidden="true">→</span></Link></div>
}
