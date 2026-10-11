import test from 'node:test';import assert from 'node:assert/strict';import {HOME_CAMERA,cameraForBuilding,isValidExternalUrl} from '../src/world-config.mjs';
test('home camera points at center',()=>assert.deepEqual(HOME_CAMERA.target,[0,0,0]));
test('building camera offset',()=>assert.deepEqual(cameraForBuilding([2,0,-3]),{target:[2,.65,-3],position:[11,9.65,9]}));
test('invalid position rejected',()=>assert.throws(()=>cameraForBuilding([NaN,0,0]),TypeError));
test('URL validation',()=>{assert.equal(isValidExternalUrl('https://github.com'),true);assert.equal(isValidExternalUrl('javascript:alert(1)'),false)});
