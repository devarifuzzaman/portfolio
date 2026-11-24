import PageHeader from '../components/PageHeader'
import { ProjectGrid } from '../components/Projects'
import CtaBand from '../components/CtaBand'
import { usePageMeta } from '../hooks'

export default function Work() {
  usePageMeta('Work', 'Selected WordPress, WooCommerce and web projects by MD Arifuzzaman.')
  return (
    <>
      <PageHeader title="Selected work" lead="Live websites built or improved for clients in different industries and countries. Open a case study for the details." />
      <div className="wrap pb-28"><ProjectGrid /></div>
      <CtaBand />
    </>
  )
}
