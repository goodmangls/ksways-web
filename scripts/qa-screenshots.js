const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = '/opt/data/reports/ksways/qa-screenshots-2026-06-12';
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'en-desktop', url: 'http://127.0.0.1:3010/', viewport: { width: 1440, height: 1200 } },
  { name: 'kr-desktop', url: 'http://127.0.0.1:3010/kr', viewport: { width: 1440, height: 1200 } },
  { name: 'en-mobile', url: 'http://127.0.0.1:3010/', viewport: { width: 390, height: 844 } },
  { name: 'kr-mobile', url: 'http://127.0.0.1:3010/kr', viewport: { width: 390, height: 844 } },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const target of targets) {
    const page = await browser.newPage({ viewport: target.viewport });
    const consoleMessages = [];
    const pageErrors = [];
    page.on('console', msg => {
      if (['error', 'warning'].includes(msg.type())) consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', err => pageErrors.push(err.message));
    const response = await page.goto(target.url, { waitUntil: 'networkidle' });
    const screenshot = path.join(outDir, `${target.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const dom = await page.evaluate(() => ({
      title: document.title,
      path: location.pathname,
      lang: document.documentElement.lang,
      h1: document.querySelector('h1')?.innerText || '',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      toggleHref: [...document.querySelectorAll('a')].find(a => a.getAttribute('aria-label') === 'Toggle language')?.getAttribute('href') || null,
    }));
    results.push({
      name: target.name,
      url: target.url,
      status: response?.status() ?? null,
      screenshot,
      consoleMessages,
      pageErrors,
      ...dom,
    });
    await page.close();
  }
  await browser.close();
  const report = path.join(outDir, 'qa-results.json');
  fs.writeFileSync(report, JSON.stringify(results, null, 2));
  console.log(report);
  console.log(JSON.stringify(results, null, 2));
})();
