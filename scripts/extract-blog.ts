/** Parses blog posts from content-source/ into content/blog.json (body HTML sanitised later at seed time). */
import fs from 'node:fs';
import * as cheerio from 'cheerio';

const SRC = 'content-source';
const files: { slug: string; file: string }[] = JSON.parse(fs.readFileSync('content/_blogfiles.json', 'utf8'));
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

// Listing page gives excerpt + category + date per slug
const list = cheerio.load(fs.readFileSync(`${SRC}/software-development-blog-in-pondicherry.php.html`, 'utf8'));
const listing = new Map<string, { excerpt: string; category: string; date: string; img: string }>();
list('.blog-card').each((_, c) => {
  const m = (list(c).attr('onclick') || '').match(/id=([^']+)/);
  if (!m) return;
  listing.set(decodeURIComponent(m[1]), {
    excerpt: clean(list(c).find('.blog-excerpt').text()),
    category: clean(list(c).find('.blog-category').text()),
    date: clean(list(c).find('.blog-date').text()),
    img: list(c).find('img').first().attr('src') || '',
  });
});

const images = new Set<string>();
const posts = files.map(({ slug, file }) => {
  const $ = cheerio.load(fs.readFileSync(`${SRC}/${file}`, 'utf8'));
  const title = clean($('.bp-title').first().text());
  const metaSpans = $('.bp-meta span').map((_, s) => clean($(s).text())).get();
  const date = metaSpans[0] || '';
  const author = metaSpans[1] || 'admin';
  const body = $('article.bp-content').html() || '';
  const l = listing.get(slug);
  const cover = $('.bp-featured-img img').attr('src') || l?.img || '';
  $('article.bp-content img').each((_, i) => { const s = $(i).attr('src'); if (s) images.add(s); });
  if (cover) images.add(cover);
  return {
    slug,
    title,
    category: clean($('.bp-cat').first().text()) || l?.category || '',
    date,
    author,
    excerpt: l?.excerpt || '',
    coverImage: cover,
    metaTitle: clean($('title').text()),
    metaDescription: $('meta[name=description]').attr('content') || '',
    body,
  };
});
fs.writeFileSync('content/blog.json', JSON.stringify(posts, null, 1));
const imgs = JSON.parse(fs.readFileSync('content/image-paths.json', 'utf8')) as string[];
for (const i of images) if (i.startsWith('/') && !imgs.includes(i)) imgs.push(i);
fs.writeFileSync('content/image-paths.json', JSON.stringify(imgs.sort(), null, 1));
console.log('posts', posts.length, 'withoutTitle', posts.filter(p => !p.title).length, 'noBody', posts.filter(p => !p.body).length, 'dates', posts.filter(p => p.date).length);
console.log(posts.slice(0, 3).map(p => [p.slug, p.date, p.category, p.coverImage].join(' | ')).join('\n'));
