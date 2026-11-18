import { test, expect } from './fixtures';
import { rendered, noHorizontalOverflow } from './helpers';
test.use({ hasTouch:true, viewport:{width:390,height:844} });
test('touch selects a section and touch dragging rotates without opening a dialog',async({page,context})=>{
 await page.goto('/');const canvas=await rendered(page);await canvas.scrollIntoViewIfNeeded();
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
 const before=await canvas.screenshot(),box=(await canvas.boundingBox())!;
 const x=box.x+box.width*.6,y=box.y+box.height*.7;
 const cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*8,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);
 expect((await canvas.screenshot()).equals(before)).toBe(false);await expect(page.getByRole('dialog')).not.toBeVisible();
 const button=page.getByRole('navigation').getByRole('button',{name:'About',exact:true});await button.scrollIntoViewIfNeeded();
 const target=(await button.boundingBox())!;await page.touchscreen.tap(target.x+target.width/2,target.y+target.height/2);
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await noHorizontalOverflow(page);
});
