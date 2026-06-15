const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
  const outDir = process.env.QA_OUT_DIR || '/opt/data/reports/ksways/seo-aeo-qa-20260615';
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const routes = [
    { route: '/', label: 'home-en' },
    { route: '/kr', label: 'home-kr' },
    { route: '/services/air-freight-korea', label: 'service-air-freight' },
    { route: '/services/ocean-freight-korea', label: 'service-ocean-freight' },
    { route: '/services/exw-pickup-korea', label: 'service-exw-pickup' },
    { route: '/network/korea-agent-network', label: 'network-agent' },
  ];
  const viewports = [
    { suffix: 'desktop', width: 1440, height: 1200 },
    { suffix: 'mobile', width: 390, height: 844 },
  ];

  const results = [];
  for (const route of routes) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const consoleMessages = [];
      const pageErrors = [];
      page.on('console', msg => {
        if (['error', 'warning'].includes(msg.type())) consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      });
      page.on('pageerror', err => pageErrors.push(String(err.message || err)));

      const url = `${baseUrl}${route.route}`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      const snapshot = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() || null,
          jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
          hasFaq: bodyText.includes('FAQ') || bodyText.includes('자주 묻는 질문'),
        };
      });
      // Keep leak checks outside the browser object literal to avoid minifier/parsing surprises.
      const leakCheck = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return {
          hasKSWAYS: bodyText.includes('KSWAYS'),
          forbiddenCopyLeak: ['MLM', 'network-marketing', 'Goodman GLS family', 'design principles'].some(term => bodyText.includes(term)),
        };
      });

      const screenshot = path.join(outDir, `${route.label}-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        route: route.route,
        viewport: viewport.suffix,
        url,
        status: response && response.status(),
        screenshot,
        consoleMessages,
        pageErrors,
        snapshot: { ...snapshot, ...leakCheck },
      });
      await page.close();
    }
  }

  await browser.close();
  const jsonPath = path.join(outDir, 'qa-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  const summary = {
    outDir,
    jsonPath,
    total: results.length,
    statusOk: results.every(r => r.status === 200),
    consoleClean: results.every(r => r.consoleMessages.length === 0),
    pageErrorsClean: results.every(r => r.pageErrors.length === 0),
    noOverflow: results.every(r => !r.snapshot.hasOverflow),
    jsonLdPresent: results.every(r => r.snapshot.jsonLdCount > 0),
    faqPresent: results.every(r => r.snapshot.hasFaq),
    noForbiddenCopyLeak: results.every(r => !r.snapshot.forbiddenCopyLeak),
  };
  console.log(JSON.stringify({ summary, results }, null, 2));
})();
