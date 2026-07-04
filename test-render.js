import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', msg => console.log('console:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('pageerror:', err.message));

await page.goto('http://127.0.0.1:4173/bookster/', { waitUntil: 'networkidle' });
console.log('title=', await page.title());
console.log('bodyText=', (await page.locator('body').innerText()).slice(0, 400));
await browser.close();
