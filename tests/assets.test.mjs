import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const names=['about','projects','skills','gallery','contact'];
for(const name of names){test(`GLB ${name} 파일이 유효하다`,()=>{const path=`public/models/${name}.glb`;assert.ok(existsSync(path),`missing ${path}`);const b=readFileSync(path);assert.equal(b.toString('utf8',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length)})}
