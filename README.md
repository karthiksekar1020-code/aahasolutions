# AAHA Solutions — website

Rebuild of https://www.aahasolutions.com/ as a **fully static site**: Next.js (static export) + React + Tailwind. There is **no backend** — no server code, no database, no admin panel, no API. `npm run build` writes plain HTML/CSS/JS to `./out`, which any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, nginx, …) can serve.
The audit of the reference site (page inventory, discrepancies, things that need owner confirmation) is in **[docs/AUDIT.md](docs/AUDIT.md)**. Parts of it describe the earlier database/admin version.

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 15.5 (App Router, `output: 'export'`) · React 19 · TypeScript (strict) |
| Styling / motion | Tailwind CSS 3.4 · Framer Motion 11 (honours `prefers-reduced-motion`) |
| Content | Plain JSON in `src/data/` (pages, blog posts, testimonials, FAQs) — edit the files and rebuild |

## Project layout
```
src/data/          the site's content (pages.json, posts.json, testimonials.json, faqs.json)
src/app/(site)/    pages: home, [...slug] (all content pages at their legacy URLs), contact, blog, blog/[slug], case studies
src/lib/           content (reads src/data), site (nav / contact details / homepage copy), env
src/components/    ui/, layout/, home/
public/            images, icons and videos (same paths as the old site)
content-source/    raw snapshots of the legacy site (audit evidence)
content/           first extraction of the legacy content (kept for reference; the site reads src/data)
scripts/           serve.mjs (static server), extract-* / download-assets / snapshot-source (one-off tools), scroll-check
```

## Run it
Requires Node 20+.
```bash
npm install
npm run dev            # development with live reload → http://localhost:3000
npm run build          # writes the static site to ./out
npm start              # serves ./out → http://localhost:3000  (PORT=… to change)
```
Set `SITE_URL` (see `.env.example`) to the real domain before the production build; it is baked into canonical URLs, Open Graph tags and `sitemap.xml`.

## Editing content
- **Text/pages/blog:** edit the JSON in `src/data/` and rebuild. Each page has `path`, `title`, `tagline`, `sections` (blocks of `p` / `ul` / `card` / `img` / `cta`), `faqs` and SEO fields. Blog `body` is HTML.
- **Navigation, contact details, homepage copy, case-study cards:** `src/lib/site.ts`.
- **Images / video:** put files in `public/assets/…` and reference them by path.

## Contact form
There is no server to receive submissions. The enquiry form checks the fields and then opens the visitor's email app with the message pre-filled, addressed to the address in `src/lib/site.ts` (`SITE.email`). If you want submissions delivered without the visitor sending an email, use a hosted form service (e.g. Formspree, Netlify Forms) and point the form at it — that is a small change in `src/components/ui/enquiry.tsx`.
The homepage assistant answers only its five built-in quick questions (company copy); there is no live AI.

## Hosting notes
A static export cannot set response headers or issue redirects itself, so configure these at the host:
- **Redirects** the old site had (`/index.php → /`, `/blog.php → …`, `/contact-us.php → /contact/`, the old `…-in-pondicherry.php` service URLs → the new `/…-company/` pages) are listed in `public/_redirects`. Netlify and Cloudflare Pages apply that file automatically; on other hosts recreate them as 301 rules. `/blog-post.php?id=<slug>` already forwards to `/blog/<slug>/` in the browser.
- **Security headers** (HTTPS/HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a Content-Security-Policy) — set in your host/CDN settings.
- Serve `404.html` for unknown URLs.

## SEO & performance
Per-page title/description/canonical/Open Graph/Twitter, JSON-LD (Organization, WebPage, BreadcrumbList, FAQPage, BlogPosting), `/sitemap.xml` and `/robots.txt` generated at build time, `next/font`. Images are served as-is (the Next image optimiser needs a server), so keep them reasonably sized. Core Web Vitals were **not** measured with Lighthouse — run it against your deployed URL.

## Checks
`npm run typecheck` · `npm run test:scroll` (needs the site running and `npx playwright install chromium`).

## Limitations (honest status)
- **Not deployed.** Only local development and a local production build were exercised.
- No admin panel: content changes are code/JSON edits plus a rebuild.
- Contact form uses the visitor's email app (see above); no submissions are stored anywhere.
- Careers résumé-upload form not rebuilt (applicants use the enquiry form/email).
- Terms & Conditions page not created (no source content; see AUDIT.md).
- Legacy-URL redirects and security headers are not included (host-level, see above).
- Facebook link in the reference footer includes a stray `?modal=admin_todo_tour`; the clean profile URL is used.
