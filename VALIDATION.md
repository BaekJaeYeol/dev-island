# Dev Island 실행 기반 정리 — 2026-11-14

## 변경 목적
기존 절차적 3D 장면과 일치하지 않던 GLB 필수 검사를 수정하고, 3D 오류 시에도 포트폴리오를 탐색할 수 있도록 한다. 기존 파스텔 Low Poly 디자인과 다섯 섹션을 유지한다.

## 구현
- 사용하지 않는 GLB 5개 요구를 실제 장면 데이터 검사로 대체. 건물별 내용, 색상, 서로 다른 좌표, 섬 경계와 카메라 좌표를 검증.
- 장면 데이터를 별도 모듈로 통합하고 3D 렌더러를 lazy import로 분리.
- Drei Text의 기본 외부 폰트 의존성을 HTML 이름표로 교체.
- 사용자 드래그를 시작하면 자동 카메라 포커스를 중단.
- 네이티브 dialog로 포커스 제한, Escape 닫기 및 이전 포커스 복귀 처리.
- WebGL2 미지원, 렌더 오류, context loss 시 2D 탐색으로 전환.
- 모션 줄이기 선호 시 부유·카메라 애니메이션 생략.
- package-lock.json 추가 및 문서의 설치 명령을 npm ci로 통일.

## 직접 확인한 결과
- Node v24.22.1, npm 11.9.0
- `npm ci --ignore-scripts`: 성공. 의존성 설치 스크립트는 실행하지 않음.
- `npm run check`: 필수 파일 10개, 테스트 5개, TypeScript 검사, Vite 프로덕션 빌드 통과.
- `npm audit --omit=dev`: 알려진 운영용 의존성 취약점 0건. 보안 전체 보장을 의미하지 않음.
- `git diff --check`: 통과.
- 빌드 산출물: 기본 JS 약 231 KB, 3D 장면 JS 약 898 KB (gzip 약 243 KB). 3D 청크 크기 경고는 남아 있음. 실제 기기 성능 측정은 미실시.

## 남은 검증
- 로컬 Vite 서버는 127.0.0.1:5173에서 기동했으나 별도 브라우저 환경에서 ERR_CONNECTION_REFUSED로 접속하지 못함. 실제 렌더링, 키보드 포커스, context loss 복구, 모바일 레이아웃은 미검증.
- 사용자 PC 또는 접근 가능한 미리보기 환경에서 다섯 건물, 카메라 드래그·확대·초기화, 모드 전환, 상세 창 열기·Tab·Escape·포커스 복귀를 확인해야 함.
- 운영 배포 미실시. 기존 Vercel 연결 여부와 배포 URL 미확인.
- GitHub Actions는 사용자 확인 전 실행하지 않음. 이번 커밋은 [skip ci]로 자동 실행을 건너뛰도록 기록.

## 참고
- https://r3f.docs.pmnd.rs/api/canvas — WebGL 미지원 fallback과 오류 경계
- https://www.w3.org/WAI/WCAG22/Techniques/html/H102 — 네이티브 modal dialog의 키보드 동작
