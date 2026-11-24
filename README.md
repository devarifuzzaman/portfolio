# MD Arifuzzaman Portfolio

React + Vite + Tailwind, with GSAP/ScrollTrigger, Framer Motion and Lenis.

## Run
```
npm install
cp .env.example .env     # add your Web3Forms key
npm run dev
```

## Edit content
Everything (links, email, projects, timeline, testimonials) is in `src/data.js`.
- Add `VITE_CONTACT_EMAIL` to `.env` or set `profile.email`.
- Fill the empty `socials` hrefs to show them.
- Project screenshots load from WordPress mShots. For permanent images, save PNG/WebP files to `public/projects/` and point `image` to them.
- Check each project's `type`, `summary` and `tags` for accuracy.
- Add objects to `testimonials` and that section appears.

## Contact form
Uses Web3Forms (free): get a key at web3forms.com and set `VITE_WEB3FORMS_KEY`. Without a key the form falls back to opening the visitor's email app.

## Deploy
Push to GitHub and import into Vercel (framework: Vite, build `npm run build`, output `dist`). Add the env vars in Vercel project settings.

## Pages and routing
Routes (React Router): `/`, `/work`, `/work/:slug`, `/services`, `/about`, `/contact`. Add a project in `src/data.js` (with a `slug` and an entry in `caseStudies`) and its case study page appears. `vercel.json` and `public/_redirects` handle SPA refreshes on Vercel and Netlify.

## Dashboard
Open `/dashboard` (not linked in the navigation; set to noindex). It manages projects, contact inquiries and a launch checklist. Data is stored in the browser's localStorage, so it is a private workspace for you rather than a shared admin. For real multi-device access or protection, add a backend and authentication.

## Google Analytics, SEO and dashboard login
- **Analytics:** set `VITE_GA_ID` (GA4 measurement ID). GA only loads after a visitor accepts the cookie banner. Tracked: page views on route changes, `generate_lead` (contact form) and `outbound_click` (live site buttons).
- **SEO:** each page sets its own title, description, canonical, Open Graph, Twitter tags and JSON-LD (`usePageMeta` in `src/hooks.js`). Update `public/sitemap.xml` when you add projects and set `VITE_SITE_URL` to your final domain (also update the URLs in `index.html` and `public/robots.txt`).
- **Dashboard login:** `/api/auth` checks `DASH_USER` and `DASH_PASSWORD` on the server and sets a signed, HttpOnly session cookie (8 hours, rate-limited). Set `DASH_USER`, `DASH_PASSWORD` and `AUTH_SECRET` in `.env` locally and in Vercel project settings. These are not exposed to the browser.

## MongoDB (all website content and projects)
1. Copy `.env.example` to `.env` and set `MONGODB_URI` (URL-encode special characters in the password: `@` becomes `%40`) and `MONGODB_DB`.
2. In MongoDB Atlas > Network Access, allow your IP (and `0.0.0.0/0` for Vercel, since its IPs change).
3. `npm run seed` copies everything in `src/data.js` into MongoDB. It is safe to run repeatedly: it only inserts missing records and fills fields a record doesn't have yet. It never deletes anything or overwrites what you edited. `npm run seed -- --force` also resets the site content sections (not projects) to the `data.js` values.
4. `npm run dev` (or `vercel dev`). Open `/dashboard`, sign in, and edit.
5. Add the same environment variables in Vercel project settings.

Collections: `projects`, `site_content` (one document per section), `inquiries`, `media` (uploaded gallery images).
API routes (`/api`): `site` (public, everything the site needs), `projects`, `content`, `inquiries`, `media`, `auth`. Write routes require the dashboard login.
`src/data.js` is kept as a reference, and the site falls back to it automatically only if the API can't be reached or the database is empty.
