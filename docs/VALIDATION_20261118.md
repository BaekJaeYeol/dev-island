# 2026-11-18 구현 및 로컬 검증

상태: 현재 MVP 범위의 코드·전체 빌드·로컬 브라우저 검증 완료. GitHub PR 후보의 결과이며 main 병합·운영 배포와 구분한다.
기준 후보 커밋: `3c59f6566f870f6204b22257aa178b06bc34421d`. 이 문서를 포함하는 커밋의 런타임 변경 파일은 아래 SHA-256으로 식별한다.

## 변경과 이유

Canvas fallback 컴포넌트의 부수 효과가 정상 WebGL까지 2D로 전환하던 오류를 제거했다. 카메라 위치를 적용한 뒤 OrbitControls를 갱신한다. 빠르게 연속으로 여는 dialog에서 이전 close 이벤트가 새 창을 닫지 않게 했다.

## 직접 실행한 검증

- Node.js 24.22.3 / npm 11.9.0 / Vite 6.4.6 / Linux.
- `npm ci --ignore-scripts --no-audit --no-fund` 성공. 루트 또는 PC의 `web`에서 실행.
- `npm test`: JavaScript/TypeScript 테스트 **6개 통과**.
- TypeScript 검사 + Vite 프로덕션 빌드 통과. 브라우저 테스트의 webServer가 빌드를 수행한다.
- `npm run test:e2e -- --workers=1`: **5개 통과**. Chromium 153.0.8010.0 headless shell / ANGLE SwiftShader 소프트웨어 WebGL2.
- 이 환경에서는 실행 경로와 launch args를 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, `PLAYWRIGHT_LAUNCH_ARGS`로 전달했다. 테스트마다 새 브라우저를 사용해 GPU teardown을 격리했다.
- `npm audit --omit=dev`: 알려진 운영 의존성 취약점 **0건**. 미발견 취약점까지 없다는 뜻은 아니다.
- `git diff --check` 통과.

확인 시나리오: 3D 진입·렌더 변화, 마우스 회전과 드래그 후 선택 억제, 5개 섹션 키보드 열기/Escape/포커스 복귀, 실시간 모션 설정, 실제 WEBGL_lose_context→2D→재시도, 320px 무가로넘침, 390px 터치 회전·선택.

테스트는 실패 주입도 포함한다. WebGL 미지원은 getContext 실패를 주입했고, 실행 중 손실은 실제 WEBGL_lose_context 확장을 사용했다. 모바일 검증은 브라우저 viewport와 터치 이벤트 에뮬레이션이다.

## 실행 방법

- Windows: 저장소 루트의 `Run-Windows.cmd` 실행. Node.js 22 이상과 최초 의존성 설치용 인터넷 연결이 필요하다. 로컬 의존성 설치·빌드가 성공한 후 loopback 주소의 preview를 열도록 구성했다. Windows에서 이 스크립트를 직접 실행하지는 않았다.
- 다른 환경: `npm ci`, `npm run build`, `npm run dev`. PC는 먼저 `cd web`.
- 일반 Chromium E2E 재현: `npx playwright install chromium`, `npm run test:e2e`.

## 미검증 및 제품 경계

- Windows/Android 실제 기기와 하드웨어 GPU, 장시간 운영은 미검증이다.
- 대형 3D 번들 경고가 남아 있으며 로딩 성능 수치를 측정하지 않았다.
- GitHub Actions·운영 배포·main 병합은 실행하지 않았다. 기존 workflow 설정은 변경하지 않았다.

## 변경 런타임 및 자산 SHA-256

```text
f70f6517304acf551a480fe51413820843a000ad6085f43e2c7aac2f0d9bfe46  src/World.tsx
f9aa9bcf67e41e6edf4a4fa8a6a21e33f26a752ee458a3204ba15d52b72625dd  src/main.tsx
```
