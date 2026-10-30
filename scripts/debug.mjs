import { chromium, firefox } from '@playwright/test';
const BASE = 'http://localhost:3000';
for (const [name, type] of [['chromium', chromium]]) {
  const b = await type.launch();
  const p = await (await b.newContext({ viewport: { width: 1431, height: 900 } })).newPage();
  const errs = [];
  p.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));
  p.on('requestfailed', r => errs.push('reqfailed: ' + r.url()));
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  for (const tab of ['AI / ML & Data', 'Frontend', 'Backend & SaaS', 'Mobile App', 'Cloud & DevOps']) {
    const t = p.getByRole('tab', { name: tab });
    await t.scrollIntoViewIfNeeded(); await t.click(); await p.waitForTimeout(300);
    const items = await p.getByRole('tabpanel').locator('li').allInnerTexts();
    console.log(name, tab, '->', items.join(' | '), '| selected:', await t.getAttribute('aria-selected'));
  }
  const panel = await p.getByRole('tabpanel').locator('ul').boundingBox();
  console.log('panel box', JSON.stringify(panel), 'viewport 1431');
  console.log('errors:', errs.length ? errs.join('\n') : 'none');
  await b.close();
}
