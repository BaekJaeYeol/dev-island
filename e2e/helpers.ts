import { expect, type Page } from '@playwright/test';
export async function rendered(page: Page) {
 const canvas = page.locator('canvas');
 await expect(canvas).toBeVisible();
 await expect.poll(() => canvas.evaluate(el => {
  const c = el as HTMLCanvasElement;
  const gl = c.getContext('webgl2');
  return c.width > 0 && c.height > 0 && !!gl && !gl.isContextLost();
 })).toBe(true);
 return canvas;
}
export async function loseContext(page: Page) {
 await page.locator('canvas').evaluate(el => {
  const gl = (el as HTMLCanvasElement).getContext('webgl2');
  const extension = gl?.getExtension('WEBGL_lose_context');
  if (!extension) throw new Error('Context loss extension unavailable');
  extension.loseContext();
 });
}
export async function noHorizontalOverflow(page: Page) {
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
export async function disableWebGL(page: Page) {
 await page.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type: any, ...args: any[]) {
   if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
   return original.apply(this, [type, ...args] as any);
  } as typeof original;
 });
}
