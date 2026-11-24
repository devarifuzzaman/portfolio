import PageHeader from '../components/PageHeader'
import ContactForm from '../components/Contact'
import { usePageMeta } from '../hooks'

export default function Contact() {
  usePageMeta('Contact', 'Start a WordPress, WooCommerce or Shopify project with MD Arifuzzaman.')
  return (
    <>
      <PageHeader title="Tell me about your project" lead="Share what you need and your timeline. I reply with a clear next step, usually within one working day." />
      <ContactForm />
    </>
  )
}
