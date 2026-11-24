import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Marquee from '../components/Marquee'
import Projects from '../components/Projects'
import Services from '../components/Services'
import Experience from '../components/Experience'
import Testimonials from '../components/Testimonials'
import CtaBand from '../components/CtaBand'
import { usePageMeta, SITE } from '../hooks'

export default function Home() {
  usePageMeta('', undefined, { jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'MD Arifuzzaman', url: SITE } })
  return (
    <>
      <Hero />
      <Stats />
      <Marquee />
      <Projects limit={3} more={{ to: '/work', label: 'View all work' }} />
      <Services title="How I can help" more={{ to: '/services', label: 'Explore services' }} />
      <Experience compact more={{ to: '/about', label: 'Full profile and experience' }} />
      <Testimonials />
      <CtaBand />
    </>
  )
}
