// Downloads every page of the legacy site into content-source/ (re-runnable audit snapshot).
import fs from 'node:fs';
const BASE = 'https://www.aahasolutions.com';
const sm = await (await fetch(BASE + '/sitemap.xml')).text();
const paths = new Set([...sm.matchAll(/<loc>([^<]+)/g)].map(m => new URL(m[1]).pathname + new URL(m[1]).search));
// Pages linked from the nav / pages but absent from sitemap: discover by crawling one level.
const seen = new Set(); const q = [...paths];
const index = [];
fs.mkdirSync('content-source', { recursive: true });
async function get(p) {
  for (let t = 0; t < 4; t++) {
    try { const r = await fetch(BASE + p, { signal: AbortSignal.timeout(25000) }); return { status: r.status, html: await r.text() }; }
    catch { await new Promise(r => setTimeout(r, 1500)); }
  }
  return { status: 0, html: '' };
}
await Promise.all([0, 1, 2, 3].map(async () => {
  while (q.length) {
    const p = q.shift(); if (seen.has(p)) continue; seen.add(p);
    const { status, html } = await get(p);
    const file = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[\/?=&]/g, '_')) + '.html';
    fs.writeFileSync('content-source/' + file, html);
    index.push({ path: p, status, file, bytes: html.length });
    for (const m of html.matchAll(/href=["']([^"'#]+)["']/g)) {
      let h = m[1]; if (h.startsWith(BASE)) h = h.slice(BASE.length);
      if (h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:') || h.match(/\.(pdf|png|jpe?g|webp|svg|css|js|ico)$/i)) continue;
      if (!h.startsWith('/')) h = '/' + h;
      if (h.startsWith('/admin') || h.startsWith('/assets')) continue;
      if (!seen.has(h) && !q.includes(h)) q.push(h);
    }
  }
}));
index.sort((a, b) => a.path.localeCompare(b.path));
fs.writeFileSync('content-source/_index.json', JSON.stringify(index, null, 1));
console.log(index.length, 'pages;', index.filter(i => i.status !== 200).length, 'non-200');
index.filter(i => i.status !== 200).forEach(i => console.log(i.status, i.path));
