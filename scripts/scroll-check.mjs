/**
 * Scroll-behaviour regression tests (real browser). Run against a running server:  node scripts/scroll-check.mjs
 * Guards the bug where the homepage jumped down on load (a mount-time scrollIntoView in the AI consultant).
 */
import { chromium } from '@playwright/test';

const BASE = process.env.E2E_BASE ?? 'http://localhost:3000';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(`${c ? '✔' : '✖'} ${n}${!c && x ? ' — ' + x : ''}`); };
const y = p => p.evaluate(() => Math.round(window.scrollY));
const settle = (p, ms = 2500) => p.waitForTimeout(ms);

// Records any programmatic scrolling that happens without user input (installed before any page script runs).
const SPY = () => {
  window.__scrollCalls = [];
  const wrap = (obj, name) => {
    const orig = obj[name];
    obj[name] = function (...a) { window.__scrollCalls.push(name + ' ' + (new Error().stack || '').split('\n').slice(2, 4).join(' | ').slice(0, 160)); return orig.apply(this, a); };
  };
  wrap(window, 'scrollTo'); wrap(window, 'scrollBy'); wrap(Element.prototype, 'scrollIntoView'); wrap(Element.prototype, 'scrollTo');
};

const b = await chromium.launch();
const sizes = [['desktop', 1440, 900], ['laptop', 1280, 720], ['tablet', 768, 1024], ['mobile', 390, 844]];

for (const [name, w, h] of sizes) {
  console.log(`\n# ${name} ${w}x${h}`);
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(SPY);
  const p = await ctx.newPage();

  // 1. Fresh open lands on the hero and stays there while hydration, video, images and animations settle.
  await p.goto(BASE + '/', { waitUntil: 'load' });
  const samples = [];
  for (let i = 0; i < 12; i++) { samples.push(await y(p)); await p.waitForTimeout(300); }
  ok('opening / starts at scrollY 0 and never moves during load (sampled 3.6s)', samples.every(v => v === 0), samples.join(','));
  await p.waitForLoadState('networkidle');
  ok('still at top after network idle', (await y(p)) === 0, String(await y(p)));
  const hero = await p.getByRole('heading', { level: 1, name: /AAHA/ }).boundingBox();
  ok('hero <h1> is visible in the first viewport', !!hero && hero.y >= 0 && hero.y < h, JSON.stringify(hero));
  ok('header is visible at the top', (await p.locator('header').first().boundingBox())?.y === 0);
  const firstSection = await p.evaluate(() => { const s = document.querySelector('main section'); return s?.getAttribute('aria-label'); });
  ok('first section in the page is the hero ("Introduction")', firstSection === 'Introduction', String(firstSection));
  ok('URL has no hash', (await p.evaluate(() => location.hash)) === '');
  const calls = await p.evaluate(() => window.__scrollCalls);
  ok('no programmatic scrollTo/scrollBy/scrollIntoView calls during load', calls.length === 0, calls.join(' || '));
  ok('focus is not stolen by an input/button on load', await p.evaluate(() => { const a = document.activeElement; return !a || a === document.body; }));

  // 2. Refresh at the top.
  await p.reload({ waitUntil: 'load' }); await settle(p);
  ok('refresh at top stays at 0', (await y(p)) === 0, String(await y(p)));

  // 3. Refresh after scrolling down must reopen at the top (no browser scroll restoration on the homepage).
  await p.evaluate(() => window.scrollTo({ top: 2500, behavior: 'instant' })); await p.waitForTimeout(400);
  ok('(setup) page scrolled down before refresh', (await y(p)) > 1500, String(await y(p)));
  await p.reload({ waitUntil: 'load' }); await settle(p, 3000);
  ok('refresh after scrolling down reopens at the top', (await y(p)) === 0, String(await y(p)));
  ok('scroll restoration stays "manual" until the visitor interacts (so the browser cannot restore the old offset late)', (await p.evaluate(() => history.scrollRestoration)) === 'manual');
  ok('no programmatic scrolling after refresh', (await p.evaluate(() => window.__scrollCalls)).length === 0, (await p.evaluate(() => window.__scrollCalls)).join(' || '));

  // 4. User-triggered scrolling still works (smooth scroll, wheel, keyboard).
  await p.mouse.wheel(0, 900); await p.waitForTimeout(600);
  ok('mouse wheel scrolling works', (await y(p)) > 300, String(await y(p)));
  ok('after first interaction scroll restoration is handed back to "auto" (normal Back/Forward)', (await p.evaluate(() => history.scrollRestoration)) === 'auto');
  await p.keyboard.press('End'); await p.waitForTimeout(1500);
  ok('End key scrolls to the bottom', (await y(p)) > 3000, String(await y(p)));
  await p.keyboard.press('Home'); await p.waitForTimeout(1500);
  ok('Home key returns to the top', (await y(p)) === 0, String(await y(p)));

  // 5. Hash / anchor behaviour is preserved.
  await p.goto(BASE + '/#ai-consultant', { waitUntil: 'load' }); await settle(p, 2000);
  const sec = await p.locator('#ai-consultant').boundingBox();
  ok('/#ai-consultant opens at that section on request', (await y(p)) > 1000 && !!sec && sec.y > -50 && sec.y < h * 0.6, `scrollY=${await y(p)} top=${sec?.y}`);
  await p.goto(BASE + '/', { waitUntil: 'load' }); await settle(p, 1200);
  await p.evaluate(() => { const a = document.createElement('a'); a.id = 'tst'; a.href = '#enquire'; a.textContent = 'x'; document.body.prepend(a); });
  await p.evaluate(() => document.getElementById('tst').click()); await p.waitForTimeout(1500);
  const enq = await p.locator('#enquire').boundingBox();
  ok('clicking an in-page anchor scrolls to its section (smooth scroll intact)', (await y(p)) > 1000 && !!enq && enq.y > -50 && enq.y < h * 0.6, `scrollY=${await y(p)} top=${enq?.y}`);
  await p.goto(BASE + '/', { waitUntil: 'load' }); await settle(p, 1200);
  ok('opening / again (no hash) is back at the top', (await y(p)) === 0, String(await y(p)));

  // 5b. Back-to-top button: hidden at the top, appears after scrolling, scrolls to top only on click.
  await p.goto(BASE + '/', { waitUntil: 'load' }); await settle(p, 1000);
  ok('back-to-top button is hidden at the top of the page', (await p.getByRole('button', { name: 'Back to top' }).count()) === 0);
  await p.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' })); await p.waitForTimeout(600);
  const btt = p.getByRole('button', { name: 'Back to top' });
  ok('back-to-top button appears after scrolling down', (await btt.count()) === 1);
  const bb = await btt.boundingBox();
  ok('back-to-top button sits at the bottom-right of the viewport', !!bb && bb.x + bb.width > w - 80 && bb.y + bb.height > h - 90 && bb.x + bb.width <= w, JSON.stringify(bb));
  await btt.click(); await p.waitForTimeout(1800);
  ok('clicking back-to-top scrolls smoothly to the top', (await y(p)) === 0, String(await y(p)));
  await p.waitForTimeout(500);
  ok('button hides again at the top', (await p.getByRole('button', { name: 'Back to top' }).count()) === 0);

  // 6. The AI consultant itself must not move the window (measured on a freshly loaded page, like a real visitor).
  {
    const q = await ctx.newPage();
    await q.goto(BASE + '/', { waitUntil: 'networkidle' }); await q.waitForTimeout(1500);
    const quick = q.getByRole('button', { name: 'Where are your global offices?' });
    // centre the button first so Playwright's own auto-scroll-into-view cannot move the page during the click
    await quick.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await q.waitForTimeout(1000);
    const before = await y(q);
    const topOf = () => q.evaluate(() => Math.round(document.getElementById('ai-consultant').getBoundingClientRect().top + window.scrollY));
    const aiTopBefore = await topOf();
    await quick.click(); await q.waitForTimeout(1500);
    ok('using the AI consultant does not scroll the page (only its own log)', (await y(q)) === before, `${before} -> ${await y(q)}`);
    ok('using the AI consultant does not shift anything above it (the panel only grows downward)', (await topOf()) === aiTopBefore, `${aiTopBefore} -> ${await topOf()}`);
    ok('the consultant still answers (vetted offline answer shown)', (await q.getByText(/Offshore Development Center in Puducherry/).count()) > 0);
    await q.close();
  }

  // 7. Reduced motion
  await ctx.close();
}

console.log('\n# Reduced-motion visitor');
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(SPY);
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await settle(p, 1500);
  ok('reduced motion: opens at the top', (await y(p)) === 0, String(await y(p)));
  await ctx.close();
}

console.log('\n# Navigation to other pages and Back/Forward');
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(SPY);
  const p = await ctx.newPage();
  await p.goto(BASE + '/contact/', { waitUntil: 'networkidle' }); await settle(p, 800);
  ok('/contact/ opens at the top', (await y(p)) === 0, String(await y(p)));
  await p.goto(BASE + '/ai-development-company-india/', { waitUntil: 'networkidle' }); await settle(p, 800);
  ok('service page opens at the top', (await y(p)) === 0, String(await y(p)));
  await p.goto(BASE + '/blog-post.php?id=rag', { waitUntil: 'networkidle' }); await settle(p, 800);
  ok('blog post opens at the top', (await y(p)) === 0, String(await y(p)));

  // client-side navigation: home -> scroll -> click a link -> new page at top -> Back
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await settle(p, 1000);
  await p.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' })); await p.waitForTimeout(500);
  const svcLink = p.getByRole('link', { name: 'Cloud Services & Development' }).first();
  await svcLink.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await p.waitForTimeout(500);
  const leftAt = await y(p);
  await svcLink.click();
  await p.waitForURL('**/cloud-services-company/'); await settle(p, 1200);
  ok('client-side navigation lands at the top of the new page', (await y(p)) === 0, String(await y(p)));
  await p.goBack(); await p.waitForURL(u => u.pathname === '/'); await settle(p, 1800);
  const back = await y(p);
  ok('Back returns to the homepage without jumping to a far-away section', back < 2500, `scrollY=${back}`);
  ok('Back restores sensible position (near where the visitor left, or top)', back === 0 || Math.abs(back - leftAt) < 300, `left at ${leftAt}, back at ${back}`);
  await p.goForward(); await p.waitForURL('**/cloud-services-company/'); await settle(p, 800);
  ok('Forward works and shows the page at a sensible position', (await y(p)) < 600, String(await y(p)));
  // header link navigation
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await settle(p, 800);
  await p.getByRole('link', { name: 'Contact Us' }).first().click(); await p.waitForURL('**/contact/'); await settle(p, 800);
  ok('header link → /contact/ at the top', (await y(p)) === 0, String(await y(p)));
  await ctx.close();
}

await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exitCode = 1;
