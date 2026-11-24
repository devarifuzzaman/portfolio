import Portrait from '../components/Portrait'
import PageHeader from '../components/PageHeader'
import AboutSection from '../components/About'
import Experience from '../components/Experience'
import Credentials from '../components/Credentials'
import Skills from '../components/Skills'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import CtaBand from '../components/CtaBand'
import { usePageMeta } from '../hooks'

export default function About() {
  usePageMeta('About', 'MD Arifuzzaman is a Top Rated Plus WordPress developer with 17+ years of experience and 100+ completed projects.')
  return (
    <>
     <PageHeader aside={<Portrait imgClass="" rise className="mx-auto h-[26rem] pt-3 w-full max-w-md rounded-2xl border border-line shadow-[0_0_60px_-20px_rgb(var(--accent)/0.35)] lg:mx-0 lg:ml-auto" />} title="About MD Arifuzzaman" lead="A WordPress and web developer with 6+ years of experience, focused on fast, maintainable websites and clear communication with clients around the world."/>
      <Stats />
      <AboutSection />
      <Experience />
      <Credentials />
      <Skills />
      <Testimonials />
      <CtaBand />
    </>
  )
}
