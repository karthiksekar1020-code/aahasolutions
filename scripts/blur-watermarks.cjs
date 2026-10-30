/**
 * Soft-blurs the visible Gemini sparkle / "Veo" corner marks in the site's background videos.
 * Only small feathered boxes around each mark are blurred; the rest of every frame is re-encoded unchanged.
 * Originals are copied to <project>/ai video/_originals-before-blur/ first (never overwritten there).
 * Usage: node blur-watermarks.cjs <ffmpeg.exe> [--dry]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/New User/Videos/aahasolutions project/';
const FFMPEG = process.argv[2];
const DRY = process.argv.includes('--dry');
const BACKUP = ROOT + 'ai video/_originals-before-blur/';

// Boxes are [x, y, w, h] in pixels of a 1280x720 frame (measured from extracted frames).
const SPARKLE_A = [1120, 560, 80, 80];   // sparkle centred ~(1160, 600)
const SPARKLE_B = [1150, 588, 80, 80];   // sparkle centred ~(1189, 627)
const VEO_TEXT = [1210, 670, 70, 50];    // "Veo" wordmark, bottom-right corner

const VIDEOS = {
  'public/videos/hero-network.mp4': [SPARKLE_A],
  'public/videos/professionals-collaborating.mp4': [SPARKLE_A],
  'public/videos/wireframe-brain.mp4': [SPARKLE_A],
  'public/assets/video/ai-chatbot-architecture.mp4': [SPARKLE_A],
  'public/assets/video/ai-network-face.mp4': [VEO_TEXT],
  'public/assets/video/dashboard-data.mp4': [SPARKLE_B, VEO_TEXT, VEO_TEXT],
  'public/videos/industrial-visit.mp4': [SPARKLE_A],
  'public/videos/robotic-assembly.mp4': [SPARKLE_A],
  'public/videos/robot-banners.mp4': [SPARKLE_A],
  'public/videos/gears-data.mp4': [SPARKLE_A],
};

function filterFor(boxes) {
  const parts = [];
  let cur = 'base0'; // boxes are measured on a 1280x720 frame, so every input is scaled to that first
  parts.push('[0:v]scale=1280:720,setsar=1[base0]');
  boxes.forEach(([x, y, w, h], i) => {
    const inset = 8;
    parts.push(
      `[${cur}]split[base${i}][src${i}]`,
      `[src${i}]crop=${w}:${h}:${x}:${y},gblur=sigma=11:steps=2,format=yuva444p[blur${i}]`,
      `color=c=black:s=${w}x${h},format=gray,drawbox=x=${inset}:y=${inset}:w=${w - 2 * inset}:h=${h - 2 * inset}:color=white:t=fill,gblur=sigma=5[mask${i}]`,
      `[blur${i}][mask${i}]alphamerge[soft${i}]`,
      `[base${i}][soft${i}]overlay=${x}:${y}:shortest=1[v${i}]`,
    );
    cur = `v${i}`;
  });
  return { graph: parts.join(';'), out: cur };
}

fs.mkdirSync(BACKUP, { recursive: true });
const report = [];
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
for (const [rel, boxes] of Object.entries(VIDEOS)) {
  if (ONLY && !rel.includes(ONLY)) continue;
  const src = ROOT + rel;
  const bak = BACKUP + path.basename(rel);
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak); // keep the first (untouched) original
  const tmp = src + '.tmp.mp4';
  const { graph, out } = filterFor(boxes);
  const args = ['-v', 'error', '-y', '-i', bak, '-filter_complex', graph, '-map', `[${out}]`, '-map', '0:a?', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', tmp];
  if (DRY) { console.log(rel, boxes.length, 'box(es)'); continue; }
  const r = spawnSync(FFMPEG, args, { encoding: 'utf8' });
  if (r.status !== 0) { console.log('FAILED', rel, r.stderr.slice(0, 400)); try { fs.unlinkSync(tmp); } catch {} continue; }
  fs.renameSync(tmp, src);
  report.push([rel, boxes.length, fs.statSync(bak).size, fs.statSync(src).size]);
  console.log('ok', rel, `${(fs.statSync(bak).size / 1e6).toFixed(1)}MB -> ${(fs.statSync(src).size / 1e6).toFixed(1)}MB`);
}
