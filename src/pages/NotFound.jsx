import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { usePageMeta } from '../hooks'

export default function NotFound() {
  usePageMeta('Page not found', undefined, { noindex: true })
  return <PageHeader title="Page not found" lead="That page doesn’t exist."><Link to="/" className="btn btn-primary mb-10">Back to home</Link></PageHeader>
}
