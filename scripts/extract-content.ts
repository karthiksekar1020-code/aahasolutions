/**
 * Parses the legacy-site snapshots in content-source/ into content/*.json
 * (structured pages + blog post list). Re-runnable.
 */
import fs from 'node:fs';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import type { Block, Section, FaqItem } from '../src/lib/content-types';

const SRC = 'content-source';
const idx: { path: string; status: number; file: string }[] = JSON.parse(fs.readFileSync(`${SRC}/_index.json`, 'utf8'));

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const imgPaths = new Set<string>();

function normPath(p: string) {
  return p.replace(/^\/\.\.\//, '/').replace(/(\.php)\/$/, '$1');
}
export function absImg(src: string) {
  if (!src || src.startsWith('data:')) return '';
  let u = src.replace(/^https?:\/\/(www\.)?aahasolutions\.com/, '');
  if (!u.startsWith('/')) u = '/' + u.replace(/^(\.\.\/)+/, '');
  imgPaths.add(u);
  return u;
}
function inlineHtml($: cheerio.CheerioAPI, el: Element) {
  const c = $(el).clone();
  c.find('script,style').remove();
  c.find('i').filter((_, n) => !$(n).text().trim()).remove();
  c.find('*').each((_, n) => {
    const e = $(n);
    const keep = ['a', 'strong', 'b', 'em', 'i', 'br'];
    if (!keep.includes((n as Element).tagName)) { e.replaceWith(e.text()); return; }
    const href = e.attr('href');
    for (const a of Object.keys((n as Element).attribs)) e.removeAttr(a);
    if ((n as Element).tagName === 'a' && href) e.attr('href', href.replace(/^https?:\/\/(www\.)?aahasolutions\.com/, ''));
    if ((n as Element).tagName === 'b') (n as Element).tagName = 'strong';
  });
  return clean(c.html() || '');
}

function dedupe(bs: Block[]) {
  const seen = new Set<string>(); const out: Block[] = [];
  for (const b of bs) { const k = JSON.stringify(b); if (seen.has(k)) continue; seen.add(k); out.push(b); }
  return out;
}

function extractPage(file: string, path: string) {
  const html = fs.readFileSync(`${SRC}/${file}`, 'utf8');
  const $ = cheerio.load(html);
  const meta = {
    title: clean($('title').first().text()),
    description: $('meta[name=description]').attr('content') || '',
    ogImage: $('meta[property="og:image"]').last().attr('content') || '',
  };
  const faqs: FaqItem[] = [];
  $('script[type="application/ld+json"]').each((_, s) => {
    try {
      const j = JSON.parse($(s).text());
      const arr = Array.isArray(j) ? j : j['@graph'] || [j];
      for (const o of arr) if (o['@type'] === 'FAQPage') for (const q of o.mainEntity || []) faqs.push({ q: q.name, a: q.acceptedAnswer?.text || '' });
    } catch {}
  });

  const h1El = $('h1').first();
  const h1 = clean(h1El.clone().children('small,span,p,br').remove().end().text()) || clean(h1El.text());
  let tagline = '';
  const heroP = h1El.parent().find('p').first();
  if (heroP.length) tagline = clean(heroP.text());
  if (!tagline) {
    const full = clean(h1El.text());
    if (full.length > h1.length) tagline = clean(full.slice(h1.length));
  }

  $('script,style,noscript,header,nav,footer,form,.modal,#homeModal,.breadcrumb-wrapper,.breadcrumb,#snackbar,#snackbar1,.navbar,.carousel-control').remove();
  $('h5').filter((_, e) => /^(About|Services & Support|Industries & Technologies|UNITED KINGDOM|INDIA)$/i.test(clean($(e).text()))).each((_, e) => {
    $(e).closest('div[class*=col]').remove();
  });

  const sections: Section[] = [];
  let cur: Section = { heading: null, blocks: [] };
  const push = (b: Block) => cur.blocks.push(b);

  function walk(node: AnyNode) {
    if (node.type !== 'tag') return;
    const el = node as Element;
    const tag = el.tagName;
    if (tag === 'h1') return;
    if (tag === 'h2') {
      if (cur.heading !== null || cur.blocks.length) sections.push(cur);
      cur = { heading: clean($(el).text()), blocks: [] };
      return;
    }
    if (/^h[3-6]$/.test(tag)) {
      const t = clean($(el).text());
      if (t) push({ t: 'p', html: `<strong>${t}</strong>` });
      return;
    }
    if (tag === 'p') { const h = inlineHtml($, el); if (h && h !== '&nbsp;') push({ t: 'p', html: h }); return; }
    if (tag === 'ul' || tag === 'ol') {
      const items = $(el).children('li').map((_, li) => inlineHtml($, li as Element)).get().filter(Boolean);
      if (items.length) push({ t: 'ul', items });
      return;
    }
    if (tag === 'img') {
      const src = absImg($(el).attr('src') || '');
      if (src && !/logo\.svg|\/icon\/|close\.svg|ct\.svg/.test(src)) push({ t: 'img', src, alt: clean($(el).attr('alt') || '') });
      return;
    }
    if (tag === 'a' && /btn|button/.test($(el).attr('class') || '') && $(el).attr('href')) {
      const label = clean($(el).text());
      const href = $(el).attr('href')!;
      if (label && !href.startsWith('#')) push({ t: 'cta', label, href: href.replace(/^https?:\/\/(www\.)?aahasolutions\.com/, '') });
      return;
    }
    const hs = $(el).find('h3,h4,h5,h6');
    if (hs.length === 1 && !$(el).find('h2').length) {
      const title = clean(hs.first().text());
      const ps = $(el).find('p,li').map((_, p) => clean($(p).text())).get().filter(Boolean);
      const own = clean($(el).clone().find('h3,h4,h5,h6,i,script').remove().end().text());
      const text = ps.join(' ') || own;
      const icon = ($(el).find('i[class*="fa-"]').first().attr('class') || '').match(/fa-([a-z0-9-]+)/g)?.filter(c => c !== 'fa-fw').pop()?.replace('fa-', '');
      if (title) { push({ t: 'card', title, text, icon }); return; }
    }
    // Plain-text containers (chips, list-like divs) that hold only inline children
    const INLINE = new Set(['span', 'a', 'strong', 'em', 'b', 'i', 'small', 'br', 'u']);
    const kids = $(el).children().toArray() as Element[];
    const hasText = el.children.some(c => c.type === 'text' && (c as any).data.trim());
    if (hasText && kids.every(c => INLINE.has(c.tagName))) {
      const h = inlineHtml($, el);
      if (h && /[A-Za-z]/.test(h)) push({ t: 'p', html: h });
      return;
    }
    if (!kids.length) {
      const h = clean($(el).text());
      if (h && /[A-Za-z]/.test(h)) push({ t: 'p', html: h });
      return;
    }
    for (const c of el.children) walk(c);
  }
  walk($('body').get(0)!);
  if (cur.heading !== null || cur.blocks.length) sections.push(cur);

  // The enquiry-form sections are replaced by the shared <EnquiryForm/> on every page.
  const FORM_HEADING = /tailored project estimate|^start your .*project|^talk to us$|^get in touch/i;
  const out = sections
    .filter(s => !(s.heading && FORM_HEADING.test(s.heading)))
    .map(s => ({ ...s, blocks: dedupe(s.blocks).filter(b => !(b.t === 'p' && /^(top|&nbsp;)$/i.test(b.html))) }))
    .filter(s => s.blocks.length || s.heading);
  return { path, h1, tagline, meta, faqs, sections: out };
}

const REDIRECT_RE = /^\/(cloud-service-company|cloud-technology-service-company|mobile-application-company|web-application-company|web-development-company|crm-development-company-in|custom-software-development-company-in)/;
const SKIP = ['/', '/index.php', '/blog.php', '/software-development-blog-in-pondicherry.php', '/contact/'];

const pages: ReturnType<typeof extractPage>[] = [];
const blogFiles: { slug: string; file: string }[] = [];
for (const e of idx) {
  if (e.status !== 200) continue;
  const p = normPath(e.path);
  if (p !== e.path) continue;
  if (p.startsWith('/blog-post.php')) { blogFiles.push({ slug: decodeURIComponent(p.split('id=')[1]), file: e.file }); continue; }
  if (SKIP.includes(p) || REDIRECT_RE.test(p) || p.startsWith('/../')) continue;
  pages.push(extractPage(e.file, p));
}
fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/pages.json', JSON.stringify(pages, null, 1));
fs.writeFileSync('content/image-paths.json', JSON.stringify([...imgPaths].sort(), null, 1));
fs.writeFileSync('content/_blogfiles.json', JSON.stringify(blogFiles));
console.log('pages', pages.length, 'blogs', blogFiles.length, 'images', imgPaths.size);
