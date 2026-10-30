// Mirrors every image/icon referenced by the legacy snapshots into public/ at the same path.
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://www.aahasolutions.com';
const set = new Set(JSON.parse(fs.readFileSync('content/image-paths.json', 'utf8')));
for (const f of fs.readdirSync('content-source')) {
  if (!f.endsWith('.html')) continue;
  const h = fs.readFileSync('content-source/' + f, 'utf8');
  for (const m of h.matchAll(/(?:src|data-src)=["']([^"']+\.(?:png|jpe?g|webp|svg|gif))["']/gi)) set.add(m[1]);
}
const norm = new Set();
for (let s of set) {
  s = s.replace(/^https?:\/\/(www\.)?aahasolutions\.com/, '');
  if (/^https?:/.test(s)) continue;
  s = '/' + s.replace(/^\/+/, '').replace(/^(\.\.\/)+/, '');
  norm.add(s);
}
const list = [...norm].filter(p => !p.includes('?'));
let ok = 0; const fail = [];
const q = [...list];
await Promise.all([0, 1, 2, 3, 4, 5].map(async () => {
  while (q.length) {
    const p = q.shift();
    const dest = path.join('public', decodeURI(p));
    if (fs.existsSync(dest)) { ok++; continue; }
    try {
      const r = await fetch(BASE + p, { signal: AbortSignal.timeout(30000) });
      if (!r.ok) { fail.push(p + ' ' + r.status); continue; }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
    } catch (e) { fail.push(p + ' ' + e.message); }
  }
}));
console.log('downloaded', ok, 'of', list.length);
fs.writeFileSync('content/asset-failures.txt', fail.join('\n'));
fail.forEach(f => console.log('FAIL', f));
