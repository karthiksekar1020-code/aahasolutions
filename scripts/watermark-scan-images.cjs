// Contact sheet of bottom-right corners of every large raster image, to spot visible AI watermarks (read-only).
const sharp = require('C:/Users/New User/Videos/aahasolutions project/node_modules/sharp');
const fs = require('fs');
const root = 'c:/Users/New User/Videos/aahasolutions project/';
const S = process.argv[2];
const big = JSON.parse(fs.readFileSync(process.env.TEMP + '/big.json', 'utf8')).filter(b => !/icons|\\icon\\/.test(b[0]));
const T = 150, COLS = 8, PER = 48;
(async () => {
  for (let s = 0; s * PER < big.length; s++) {
    const chunk = big.slice(s * PER, (s + 1) * PER);
    const comps = [];
    for (let i = 0; i < chunk.length; i++) {
      const [f, w, h] = chunk[i];
      const cw = Math.round(w * 0.2), ch = Math.round(h * 0.2);
      const buf = await sharp(root + f.replace(/\\/g, '/')).extract({ left: w - cw, top: h - ch, width: cw, height: ch }).resize(T, T, { fit: 'cover' }).flatten({ background: '#888' }).png().toBuffer();
      const x = (i % COLS) * (T + 6), y = Math.floor(i / COLS) * (T + 6);
      const label = Buffer.from(`<svg width="${T}" height="22" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="22" fill="#000"/><text x="4" y="16" font-size="16" fill="#ff0" font-family="Arial">${s * PER + i}</text></svg>`);
      comps.push({ input: buf, left: x, top: y }, { input: label, left: x, top: y });
    }
    const rows = Math.ceil(chunk.length / COLS);
    await sharp({ create: { width: COLS * (T + 6), height: rows * (T + 6), channels: 3, background: '#333' } }).composite(comps).png().toFile(`${S}/sheet${s}.png`);
    console.log('sheet' + s, chunk.length);
  }
  fs.writeFileSync(S + '/index.json', JSON.stringify(big));
})();
