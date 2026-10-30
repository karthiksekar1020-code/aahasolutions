// Zero-dependency static file server for the exported site in ./out.   Usage: npm run build && npm start   (PORT=3000 by default)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf',
};

if (!fs.existsSync(ROOT)) { console.error('No ./out folder. Run "npm run build" first.'); process.exit(1); }

const isFile = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const isDir = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

function send(req, res, file, status = 200) {
  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
  if (range && status === 200) { // video seeking
    const start = range[1] ? Number(range[1]) : 0, end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': file.includes(`${path.sep}_next${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache' });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  const target = path.normalize(path.join(ROOT, rel));
  if (!target.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  if (isFile(target)) return send(req, res, target);
  // Next's client router asks for "/page.php.txt" (prefetch payload) but the export stores it at "/page.php/index.txt"
  if (target.endsWith('.php.txt') && isFile(path.join(target.slice(0, -4), 'index.txt'))) return send(req, res, path.join(target.slice(0, -4), 'index.txt'));
  if (isDir(target)) {
    // directory pages live at <dir>/index.html; send people to the trailing-slash URL like a real host does
    // (legacy ".php" page URLs are served as-is, without the slash, to keep the original addresses)
    if (!rel.endsWith('/') && !rel.endsWith('.php')) { res.writeHead(308, { Location: `${rel}/${url.search}` }); return res.end(); }
    if (isFile(path.join(target, 'index.html'))) return send(req, res, path.join(target, 'index.html'));
  }
  if (isFile(`${target}.html`)) return send(req, res, `${target}.html`);
  const notFound = path.join(ROOT, '404.html');
  if (isFile(notFound)) return send(req, res, notFound, 404);
  res.writeHead(404); res.end('Not found');
}).listen(PORT, () => console.log(`Static site on http://localhost:${PORT}  (serving ./out)`));
