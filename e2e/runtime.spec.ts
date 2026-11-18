import { test, expect } from './fixtures';
import { rendered, loseContext, disableWebGL, noHorizontalOverflow } from './helpers';

test('WebGL enters 3D, responds to drag, and survives reduced-motion changes', async ({ page }) => {
 const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
 await page.goto('/'); const canvas = await rendered(page);
 await expect(page.locator('.world-heading')).toContainText('3D 탐색');
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.waitForTimeout(300);
 const before = await canvas.screenshot();
 const box = (await canvas.boundingBox())!;
 await page.mouse.move(box.x + box.width * .7, box.y + box.height * .65);
 await page.mouse.down(); await page.mouse.move(box.x + box.width * .4, box.y + box.height * .65, { steps: 12 }); await page.mouse.up();
 await page.waitForTimeout(400);
 expect((await canvas.screenshot()).equals(before)).toBe(false);
 await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.getByRole('button', { name: '↻ 처음 시점' }).click();
 await rendered(page);
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await page.screenshot({ path: 'test-results/island-3d.png' });
 expect(errors).toEqual([]);
});

test('all five sections open by keyboard and Escape returns focus', async ({ page }) => {
 await page.goto('/'); await rendered(page);
 for (const label of ['About','Projects','Skills','Experience','Contact']) {
  const button = page.getByRole('navigation').getByRole('button', { name: label, exact: true });
  await button.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
 }
});

test('real context loss switches to usable 2D and retry recreates the renderer', async ({ page }) => {
 await page.goto('/'); await rendered(page); await loseContext(page);
 await expect(page.locator('.world-heading')).toContainText('2D 탐색');
 await page.locator('.grid').getByRole('button').first().click();
 await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape');
 await page.getByRole('button', { name: '3D 보기', exact: true }).click();
 await rendered(page);
 await page.getByRole('button', { name: '☾ 밤 모드' }).click();
 await expect(page.locator('.app')).toHaveAttribute('data-theme','night');
});

test('mobile fallback works without WebGL and never overflows', async ({ page }) => {
 await disableWebGL(page); await page.setViewportSize({ width: 320, height: 780 }); await page.goto('/');
 await expect(page.locator('.grid button')).toHaveCount(5); await noHorizontalOverflow(page);
 await page.getByRole('button', { name: '3D 보기', exact: true }).click();
 await expect(page.getByText('3D 화면을 표시할 수 없어 2D로 전환했어요.')).toBeVisible();
});
