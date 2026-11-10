import { test, expect, chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

let server;
let origin;
let context;
let profile;
let page;
const ui = (selector) => page.locator(`#chrome-note-drawer ${selector}`);
const fixture = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>日常工作台</title>
<style>body{margin:0;background:#f4f6f9;color:#35475b;font:16px system-ui,sans-serif}main{max-width:720px;margin:100px auto;padding:0 40px}small{letter-spacing:4px;color:#8b9aab;font-size:11px}h1{font-size:36px;font-weight:500;letter-spacing:2px;margin:20px 0}p{font-size:14px;color:#8a98a8;line-height:2}.line{height:1px;background:#e0e6ed;margin:40px 0}.placeholder{height:14px;border-radius:4px;background:#e5eaf0;margin:20px 0;width:85%}.placeholder:nth-child(even){width:65%}textarea{width:100%;height:100px;background:white;border:1px solid #e0e6ed;border-radius:10px;padding:16px;box-sizing:border-box}</style>
<main><small>YOUR EVERYDAY SPACE</small><h1>每一天，少一点重复。</h1><p>专注眼前的事，把常用的话留在手边。</p><div class="line"></div><div class="placeholder"></div><div class="placeholder"></div><div class="placeholder"></div><p>在这里粘贴一段文本</p><textarea aria-label="网页输入框" placeholder="试试从右侧抽屉复制一段文本…"></textarea></main></html>`;

test.beforeAll(async () => {
  server = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(fixture);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => { await new Promise((resolve) => server.close(resolve)); });

test.beforeEach(async () => {
  profile = await mkdtemp(path.join(tmpdir(), 'chrome-note-test-'));
  const extension = path.resolve('extension');
  context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    viewport: { width: 1280, height: 900 },
    args: ['--enable-unsafe-extension-debugging', '--no-sandbox'],
  });
  const cdp = await context.browser().newBrowserCDPSession();
  await cdp.send('Extensions.loadUnpacked', { path: extension });
  page = await context.newPage();
  await page.goto(origin);
  await expect(ui('.handle')).toBeVisible();
});

test.afterEach(async () => {
  await context?.close();
  if (profile) await rm(profile, { recursive: true, force: true });
});

async function open() {
  if (await ui('.handle').getAttribute('aria-expanded') === 'false') {
    await page.mouse.move(400, 100);
    // aria-hidden changes immediately; wait for an earlier collapse to settle
    // before targeting the handle at its final, right-edge position.
    await page.locator('#chrome-note-drawer').evaluate(async (el) => {
      await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => {})));
    });
  }
  await ui('.handle').hover();
  await expect(ui('.handle')).toHaveAttribute('aria-expanded', 'true');
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'false');
  await expect.poll(async () => (await ui('.panel').boundingBox()).x).toBeLessThan(1000);
}

async function add(title, text) {
  await ui('.add').click();
  await ui('input[name="title"]').fill(title);
  await ui('textarea[name="text"]').fill(text);
  await ui('.save').click();
  await expect(ui('.editor')).toBeHidden();
  await expect(ui('.card-title').filter({ hasText: title })).toBeVisible();
}

test('hover opens, pointer leave waits 100ms, re-entry cancels, Escape and keyboard work', async () => {
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true');
  const box = await ui('.handle').boundingBox();
  expect(Math.round(box.x + box.width)).toBe(1280);
  expect(await page.evaluate(() => document.elementFromPoint(1270, 200)?.id)).not.toBe('chrome-note-drawer');
  await open();
  await page.mouse.move(400, 100);
  await page.waitForTimeout(30);
  await page.mouse.move(1260, 180);
  await page.waitForTimeout(180);
  await expect(ui('.handle')).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => {
    const host = document.getElementById('chrome-note-drawer');
    const handle = host.shadowRoot.querySelector('.handle');
    host.addEventListener('pointerleave', () => {
      const start = performance.now();
      const observer = new MutationObserver(() => {
        if (handle.getAttribute('aria-expanded') === 'false') {
          window.collapseDelay = performance.now() - start;
          observer.disconnect();
        }
      });
      observer.observe(handle, { attributes: true, attributeFilter: ['aria-expanded'] });
    }, { once: true });
  });
  await page.mouse.move(400, 100);
  await expect(ui('.handle')).toHaveAttribute('aria-expanded', 'false', { timeout: 700 });
  const delay = await page.evaluate(() => window.collapseDelay);
  expect(delay).toBeGreaterThanOrEqual(85);
  expect(delay).toBeLessThan(500);
  await ui('.handle').focus();
  await page.keyboard.press('Enter');
  await expect(ui('.search input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true');
});

test('create, copy exact multiline text, edit, filter, persist, synchronize tabs, delete', async () => {
  const text = '你好，感谢你的反馈！\n  我们会尽快处理。  \n';
  await open();
  await add('常用回复', text);
  await context.grantPermissions(['clipboard-read'], { origin });
  await ui('.copy-card').click();
  await expect(ui('.card')).toHaveClass(/copied/);
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(text);
  await page.getByRole('textbox', { name: '网页输入框' }).fill(await page.evaluate(() => navigator.clipboard.readText()));
  await page.reload();
  await open();
  await expect(ui('.card-title')).toHaveText('常用回复');
  await ui('.edit').click();
  await expect(ui('textarea[name="text"]')).toHaveValue(text);
  await ui('input[name="title"]').fill('更新后的回复');
  await ui('textarea[name="text"]').fill('新的内容 <script>alert(1)</script>');
  await page.keyboard.press('Control+Enter');
  await expect(ui('.card-title')).toHaveText('更新后的回复');
  await expect(ui('.card-body')).toHaveText('新的内容 <script>alert(1)</script>');
  await ui('.search input').fill('找不到');
  await expect(ui('.card')).toHaveCount(0);
  await expect(ui('.empty h2')).toHaveText('没有找到这条文本');
  await ui('.search input').fill('新的内容');
  await expect(ui('.card')).toHaveCount(1);
  const other = await context.newPage();
  await other.goto(origin + '/second');
  await other.locator('#chrome-note-drawer .handle').hover();
  await expect(other.locator('#chrome-note-drawer .card-title')).toHaveText('更新后的回复');
  await page.bringToFront();
  await open();
  await ui('.edit').click();
  await ui('.delete').click();
  await expect(ui('.delete-confirm')).toBeVisible();
  await ui('.keep').click();
  await expect(ui('.card')).toHaveCount(1);
  await ui('.delete').click();
  await ui('.confirm-delete').click();
  await expect(ui('.card')).toHaveCount(0);
  await expect(other.locator('#chrome-note-drawer .card')).toHaveCount(0);
});

test('drag adjusts and persists position without becoming a click', async () => {
  const before = await ui('.handle').boundingBox();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2 + 200, { steps: 12 });
  await page.mouse.up();
  await expect(ui('.handle')).toHaveAttribute('aria-expanded', 'false');
  const after = await ui('.handle').boundingBox();
  expect(after.y).toBeGreaterThan(before.y + 180);
  await page.mouse.move(100, 100);
  await page.reload();
  await expect.poll(async () => (await ui('.handle').boundingBox()).y).toBeCloseTo(after.y, 0);
  await page.setViewportSize({ width: 480, height: 560 });
  await open();
  const panelBox = await ui('.panel').boundingBox();
  expect(panelBox.x).toBeGreaterThanOrEqual(0);
  expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(560);
});

test('long list scrolls, validates whitespace, preserves an unfinished draft on collapse', async () => {
  await open();
  await ui('.add').click();
  await ui('input[name="title"]').fill('   ');
  await ui('textarea[name="text"]').fill('   ');
  await ui('.save').click();
  await expect(ui('.status')).toContainText('不能只有空格');
  await ui('input[name="title"]').fill('未完成的草稿');
  await page.mouse.move(200, 200);
  await ui('.collapse').click();
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true');
  await open();
  await expect(ui('input[name="title"]')).toHaveValue('未完成的草稿');
  await ui('button.cancel').last().click();
  for (let i = 1; i <= 9; i++) await add(`文本 ${i}`, `第 ${i} 条文本\n第二行文本\n第三行文本`);
  const scroll = await ui('.list').evaluate((el) => {
    el.scrollTop = el.scrollHeight;
    return { height: el.clientHeight, total: el.scrollHeight, top: el.scrollTop };
  });
  expect(scroll.total).toBeGreaterThan(scroll.height);
  expect(scroll.top).toBeGreaterThan(0);
  await expect(ui('.count')).toHaveText('09');
});

test('new and existing notes stay open while typing with the mouse outside; browsing closes after saving', async () => {
  await open();
  await ui('.add').click();
  await page.mouse.move(200, 200);
  await page.waitForTimeout(1200);
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'false');
  await expect(ui('input[name="title"]')).toBeFocused();
  await page.keyboard.type('Regression note', { delay: 20 });
  await page.keyboard.press('Tab');
  await page.keyboard.type('Typing with the cursor outside', { delay: 20 });
  await expect(ui('textarea[name="text"]')).toHaveValue('Typing with the cursor outside');
  await expect(ui('.close-hint')).toHaveText('编辑中，保持展开');
  // Even losing focus must not hide the editor or discard its draft.
  await page.getByRole('textbox', { name: '网页输入框' }).click();
  await page.waitForTimeout(250);
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'false');
  await ui('textarea[name="text"]').focus();
  await page.keyboard.press('Control+Enter');
  await expect(ui('.editor')).toBeHidden();
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true', { timeout: 700 });
  await open();
  await ui('.edit').click();
  await page.mouse.move(200, 200);
  await page.waitForTimeout(250);
  await page.keyboard.press('End');
  await page.keyboard.type(' updated');
  await expect(ui('input[name="title"]')).toHaveValue('Regression note updated');
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'false');
  await ui('button.cancel').last().focus();
  await page.keyboard.press('Enter');
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true', { timeout: 700 });
  await open();
  await ui('.search input').focus();
  await page.mouse.move(200, 200);
  await page.keyboard.type('Regression', { delay: 20 });
  await page.waitForTimeout(250);
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'false');
  await page.getByRole('textbox', { name: '网页输入框' }).click();
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true', { timeout: 700 });
});

test('light-blue drawer screenshot and style isolation on a host page', async () => {
  await open();
  await add('工作邮箱', 'hello@example.com');
  await add('收件地址', '浙江省杭州市西湖区\n文一西路 88 号 · 310000');
  await add('礼貌回复', '收到，谢谢你的分享！\n我会仔细阅读，稍后给你反馈。');
  await add('AI 提示词', '请用简洁、清晰的中文总结以下内容，\n保留关键信息，并列出下一步行动。');
  const hostileStyle = await page.addStyleTag({ content: 'button { background: red !important; font-size: 40px !important; } h1 { color: red !important; }' });
  expect(await ui('h1').evaluate((el) => getComputedStyle(el).color)).not.toBe('rgb(255, 0, 0)');
  await hostileStyle.evaluate((el) => el.remove());
  await ui('.card').nth(1).hover();
  await page.waitForTimeout(2600);
  await mkdir('docs', { recursive: true });
  await page.screenshot({ path: 'docs/drawer.png' });
  await page.mouse.move(200, 200);
  await expect(ui('.panel')).toHaveAttribute('aria-hidden', 'true', { timeout: 1700 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'docs/collapsed.png' });
});
