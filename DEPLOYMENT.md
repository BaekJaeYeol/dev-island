# Dev Island 배포 절차

1. Node.js 22 이상 설치
2. `npm ci`
3. `npm run check`
4. GitHub 저장소를 Vercel 프로젝트로 Import
5. Framework: Vite, Build Command: `npm run build`, Output Directory: `dist`
6. 배포 후 건물 선택, 드래그·확대·초기화, 낮/밤 전환, 2D 전환, 모바일, 키보드 흐름 확인

현재 장면은 코드로 생성하므로 GLB 업로드가 필요하지 않습니다.
실제 배포와 브라우저 검증 여부는 VALIDATION.md를 확인하세요.
GitHub Actions를 실행하려면 사용자 확인을 먼저 받으세요.
