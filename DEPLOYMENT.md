# Dev Island 배포 절차

1. Node.js 22 이상 설치
2. `npm install`
3. `npm run preflight` 및 `npm test`
4. `npm run build`
5. GitHub 저장소를 Vercel 프로젝트로 Import
6. Framework: Vite, Build Command: `npm run build`, Output Directory: `dist`
7. 배포 후 3D 렌더링, GLB 로딩, 건물 선택, 모바일 UI 검증

현재 브라우저 및 빌드 검증은 아직 완료되지 않았습니다.
