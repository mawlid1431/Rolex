import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const label = process.argv[2] ?? 'after'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' })
await mkdir('test-results', { recursive: true })
await page.screenshot({ path: `test-results/${label}-home.png` })
const initial = await page.evaluate(() => ({
  media: performance.getEntriesByType('resource').filter(r => /\.(avif|webp|mp4|webm)/.test(r.name)).map(r => ({ url: new URL(r.name).pathname, bytes: r.transferSize })),
  hero: document.querySelector('#hero').getBoundingClientRect().toJSON(),
  video: { duration: document.querySelector('video').duration, time: document.querySelector('video').currentTime },
}))
const scroll = await page.evaluate(async () => {
  const intervals = []
  let previous = performance.now()
  for (let i = 0; i < 180; i++) {
    await new Promise(requestAnimationFrame)
    const now = performance.now()
    intervals.push(now - previous)
    previous = now
    window.scrollTo(0, i * 14)
  }
  intervals.sort((a,b) => a-b)
  return { p95: intervals[Math.floor(intervals.length * .95)], over50ms: intervals.filter(t => t > 50).length, frames: intervals.length }
})
await page.screenshot({ path: `test-results/${label}-scrolled.png` })
await page.evaluate(() => window.scrollTo(0, 0))
await page.getByRole('button', { name: 'Search', exact: true }).click()
const input = page.getByRole('searchbox')
await input.waitFor({ state: 'visible' })
const searchReceivesPointer = await input.evaluate(el => {
  const r = el.getBoundingClientRect()
  return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === el
})
await page.screenshot({ path: `test-results/${label}-search.png` })
const report = { initial, scroll, searchReceivesPointer, errors }
await writeFile(`test-results/${label}-audit.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
await browser.close()
