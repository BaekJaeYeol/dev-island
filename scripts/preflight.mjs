import { existsSync } from 'node:fs';
const required=['index.html','package.json','tsconfig.json','src/main.tsx','src/style.css','src/projects.ts','src/world-config.mjs','public/models/about.glb','public/models/projects.glb','public/models/skills.glb','public/models/gallery.glb','public/models/contact.glb'];
const missing=required.filter(path=>!existsSync(path));
if(missing.length){console.error('누락된 파일:',missing.join(', '));process.exitCode=1}else{console.log('필수 파일 확인 완료:',required.length)}
