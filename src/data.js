// All editable content lives here. Fill in the empty links/email to show them on the site.
export const profile = {
  name: 'MD Arifuzzaman',
  role: 'WordPress & Web Developer',
  email: import.meta.env?.VITE_CONTACT_EMAIL || '', // or set it here
  site: 'https://devarifuzzaman.vercel.app/',
  socials: [
    { label: 'Upwork', href: '' },    // your Upwork profile URL
    { label: 'LinkedIn', href: '' },  // your LinkedIn URL
    { label: 'GitHub', href: '' },    // your GitHub URL
  ],
}

export const nav = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const stats = [
  { value: 17, suffix: '+', label: 'Years of hands-on experience' },
  { value: 100, suffix: '+', label: 'Web projects completed' },
  { text: 'Top Rated Plus', label: 'Talent badge on Upwork' },
]

export const specSheet = [
  ['Focus', 'WordPress, WooCommerce, Shopify'],
  ['Builds with', 'Elementor, Crocoblock, Gutenberg, Divi'],
  ['Engineering', 'PHP, custom themes, plugins, REST APIs'],
  ['Also', 'Wix, performance, Technical SEO'],
  ['Clients', 'International, remote-first'],
]

export const services = [
  { title: 'WordPress development', text: 'Fast, maintainable sites on custom or carefully chosen themes, built so your team can edit them without a developer.', tags: ['Custom themes', 'Gutenberg', 'Multisite'] },
  { title: 'Elementor, Crocoblock and Divi builds', text: 'Dynamic, design-accurate pages with custom post types, listings, filters and forms, without bloated page-builder output.', tags: ['Elementor', 'Crocoblock', 'Divi'] },
  { title: 'WooCommerce and Shopify stores', text: 'Storefronts that load quickly and convert: catalog structure, checkout, payments, shipping and product import.', tags: ['WooCommerce', 'Shopify', 'Wix'] },
  { title: 'Custom plugins and integrations', text: 'Features that off-the-shelf plugins can’t cover: REST API integrations, CRM and payment connections, admin tools.', tags: ['PHP', 'REST API', 'Plugins'] },
  { title: 'Technical SEO and speed', text: 'Core Web Vitals, crawlability, schema, redirects and clean markup so search engines and visitors both get a better site.', tags: ['Core Web Vitals', 'Schema', 'Audits'] },
]

export const shot = (u) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=1200&h=750`
// Swap `image` for a local file in /public/projects/ if you prefer your own screenshots.
export const projects = [
  { slug: 'shemart', name: 'Shemart', url: 'https://shemart.net/', image: shot('https://shemart.net/'), type: 'eCommerce', summary: 'Online store focused on a clear catalog, quick browsing and a smooth checkout.', tags: ['WooCommerce', 'Performance'] },
  { slug: 'howplatform', name: 'HowPlatform', url: 'https://howplatform.io/', image: shot('https://howplatform.io/'), type: 'Platform website', summary: 'Product-led marketing site with a structured layout and strong technical SEO foundations.', tags: ['WordPress', 'Technical SEO'] },
  { slug: 'kapinga', name: 'Kapinga', url: 'https://kapinga.co.uk/', image: shot('https://kapinga.co.uk/'), type: 'Business website', summary: 'UK business website designed for clarity, trust and easy enquiries.', tags: ['WordPress', 'Elementor'] },
  { slug: 'dealeredge', name: 'DealerEdge', url: 'https://dealeredge.com.au/', image: shot('https://dealeredge.com.au/'), type: 'Business website', summary: 'Australian B2B website built to explain a service clearly and generate leads.', tags: ['WordPress', 'Custom development'] },
  { slug: 'realtalkhhi', name: 'RealTalkHHI', url: 'https://www.realtalkhhi.com/', image: shot('https://www.realtalkhhi.com/'), type: 'Content website', summary: 'Content-driven website with an editor-friendly structure and fast page loads.', tags: ['WordPress', 'Content'] },
]

export const defaultProjects = projects.map((p) => ({ ...p, status: 'published' }))

export const skills = [
  { group: 'CMS and builders', items: ['WordPress', 'Elementor', 'Crocoblock', 'Gutenberg', 'Divi', 'Wix'] },
  { group: 'Commerce', items: ['WooCommerce', 'Shopify', 'Payment gateways', 'Product catalogs'] },
  { group: 'Engineering', items: ['PHP', 'Custom themes', 'Custom plugins', 'REST APIs', 'JavaScript', 'MySQL'] },
  { group: 'Growth and quality', items: ['Technical SEO', 'Core Web Vitals', 'Schema markup', 'Security hardening', 'Migrations'] },
]

export const timeline = [
  { when: '2009', title: 'Started building websites professionally', text: 'HTML, CSS and PHP projects for small businesses.' },
  { when: 'Early years', title: 'Moved into WordPress', text: 'Custom themes and plugins became the core of my work.' },
  { when: 'Growth', title: 'Added eCommerce and page builders', text: 'WooCommerce, Shopify, Elementor and Crocoblock projects for growing brands.' },
  { when: 'Today', title: 'Top Rated Plus on Upwork', text: '100+ projects delivered for international clients, with a focus on performance and Technical SEO.' },
]

// Add { quote, name, role } objects here and the testimonials section appears automatically.
export const testimonials = []

export const caseStudies = {
  shemart: 'Give shoppers a fast, simple way to browse the catalog and check out on any device.',
  howplatform: 'Explain a technical platform clearly while keeping the site fast and easy for search engines to crawl.',
  kapinga: 'Present a UK business credibly and make it easy for visitors to get in touch.',
  dealeredge: 'Communicate a B2B offering to Australian customers and turn visits into qualified leads.',
  realtalkhhi: 'Publish content regularly without a developer, while keeping pages quick to load.',
}
// Shared across case studies. Replace with project-specific detail and real results when you have them.
export const approach = [
  { title: 'Discovery and structure', text: 'Goals, audience, content and page structure agreed before any build starts.' },
  { title: 'Build', text: 'Clean, responsive implementation with reusable components and an editor-friendly back end.' },
  { title: 'Performance and SEO pass', text: 'Image optimisation, caching, Core Web Vitals checks, schema and crawlable markup.' },
  { title: 'Launch and handover', text: 'Testing across devices, a safe go-live and a walkthrough so the team can manage the site.' },
]
export const outcomes = ['Responsive layout across desktop, tablet and mobile', 'Optimised images and caching for faster loads', 'Clean, crawlable markup with technical SEO foundations', 'A back end the client’s team can edit confidently']

export const process = [
  { title: 'Discover', text: 'A short call or brief to understand your goals, audience, budget and deadline.' },
  { title: 'Plan', text: 'A clear scope, structure and timeline, so there are no surprises.' },
  { title: 'Build', text: 'Regular progress updates and a staging site you can review at any time.' },
  { title: 'Launch and support', text: 'Careful go-live, speed and SEO checks, and help after launch.' },
]
export const faqs = [
  { q: 'Which platforms do you work with?', a: 'WordPress (with Elementor, Crocoblock, Gutenberg or Divi), WooCommerce, Shopify and Wix, plus custom PHP themes and plugins.' },
  { q: 'Can you fix or speed up an existing site?', a: 'Yes. I audit performance, security and technical SEO, then fix the issues in order of impact.' },
  { q: 'Do you work with international clients and agencies?', a: 'Yes. I work remotely with clients and agencies across time zones, including through Upwork.' },
  { q: 'How do you price projects?', a: 'After understanding the scope I send a fixed quote or an estimate, depending on how well-defined the work is.' },
  { q: 'Will I be able to edit the site myself?', a: 'That’s the goal. I build with editor-friendly layouts and hand over a short walkthrough.' },
]

// Role descriptions are written from your job titles and skills. Edit them to match what you actually did.
export const experience = [
  {
    role: 'WordPress Developer', company: 'Flowex Agency', url: 'https://flowex.agency', period: 'Aug 2025 – Sep 2026', location: 'Dhaka, Bangladesh · Remote',
    summary: 'Delivered WordPress websites for agency clients, from design hand-off to launch, with a focus on speed, maintainability and search visibility.',
    points: ['Built custom WordPress sites with Elementor, Crocoblock and custom theme code from design files', 'Developed WooCommerce storefronts and integrated third-party services', 'Improved page speed and Technical SEO using Core Web Vitals audits and clean markup', 'Worked with designers and project managers to ship on schedule'],
    tags: ['WordPress', 'Elementor', 'Crocoblock', 'WooCommerce', 'Technical SEO'],
  },
  {
    role: 'Web Developer', company: 'DigitalGregg', url: 'https://digitalgregg.com', period: 'Jun 2022 – Dec 2024', location: 'Chicago, USA · Remote',
    summary: 'Worked remotely with a US-based team, building and maintaining client websites and improving their performance and search rankings.',
    points: ['Developed and maintained responsive websites on WordPress, WooCommerce and Shopify', 'Customised themes and plugins to meet specific business requirements', 'Ran speed and SEO improvements, plus security and backup routines for client sites', 'Communicated daily across time zones with clear updates and documentation'],
    tags: ['WordPress', 'WooCommerce', 'Shopify', 'PHP', 'SEO'],
  },
  {
    role: 'Junior Web Developer', company: 'CodeCareBD', url: 'https://codecarebd.com', period: 'Jan 2019 – May 2022', location: 'Kushtia, Khulna',
    summary: 'Started in a development team, turning designs into working websites and building the foundation in WordPress and PHP.',
    points: ['Converted designs into responsive HTML, CSS and JavaScript pages', 'Built WordPress themes, templates and plugin customisations', 'Fixed bugs, handled content updates and supported live client sites', 'Learned code review, version control and delivery practices from senior developers'],
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
  },
]

export const strengths = [
  { title: 'Built for speed', text: 'Lean code and optimised assets so pages load quickly on any device.' },
  { title: 'Easy to manage', text: 'Editor-friendly back ends, so your team can update content without a developer.' },
  { title: 'Found by search engines', text: 'Technical SEO, schema and clean markup built in from the start.' },
  { title: 'Clear communication', text: 'Regular updates and honest timelines, across any time zone.' },
]

export const hero = {
  status: 'Available for new projects',
  headline: 'WordPress and eCommerce websites, engineered to perform.',
  roles: ['WordPress themes', 'WooCommerce stores', 'Shopify storefronts', 'custom plugins', 'Technical SEO'],
  intro: 'I’m MD Arifuzzaman, a Top Rated Plus Upwork developer with 17+ years of experience building custom themes, plugins, WooCommerce and Shopify stores, and technically sound SEO for clients around the world.',
}
export const about = {
  title: 'Professional profile',
  paragraphs: [
    'I’m a WordPress developer who has spent nearly two decades building websites for businesses, agencies and startups. I’ve completed 100+ projects and earned Top Rated Plus status on Upwork.',
    'My work spans custom themes and plugins, Elementor and Crocoblock builds, WooCommerce and Shopify stores, and Technical SEO. I’ve worked in agency teams and as a remote developer for US clients, so I’m comfortable with deadlines, handovers and time zones.',
    'I care about the parts clients feel: pages that load quickly, a back end their team can manage, and a site that search engines can read.',
  ],
}
export const marquee = { rows: [
  ['WordPress', 'Elementor', 'WooCommerce', 'Shopify', 'Crocoblock', 'Gutenberg', 'Divi', 'Wix'],
  ['PHP', 'REST APIs', 'Custom themes', 'Custom plugins', 'Technical SEO', 'Core Web Vitals', 'Schema', 'Migrations'],
] }
export const settings = { siteName: 'MD Arifuzzaman', siteUrl: profile.site, nav }
// Not in the original demo data, so they start empty (add them from Dashboard > Site content).
// education:      [{ school, degree, period, note }]
// certifications: [{ name, issuer, year, url }]
export const education = []
export const certifications = []
