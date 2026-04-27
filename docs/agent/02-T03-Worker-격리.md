# T03 — Web Worker 격리 실행

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [x] antigravity
- [ ] 직접

## 에이전트에게 위임한 작업의 범위

- Codex에 `workerProtocol.ts`, `yaksok.worker.ts`, `runWithWorker.ts` 구현을 위임했다.
- Worker 통신 타입 정의, Worker 내부 런타임 실행, 5초 타임아웃 및 `terminate` 처리까지 포함해 T03 구현 전 범위를 맡겼다.
- Claude에는 완성 코드 리뷰를 맡겨 누락된 오류 처리 경로를 점검했다.
- antigravity에는 브라우저 기반 동작 검증(정상/타임아웃/UI 비블로킹/런타임 에러)을 맡겼다.

## 위임 판단 근거

- Worker 격리 실행 패턴은 보일러플레이트가 명확해 Codex가 빠르게 구현하기 적합했다.
- T03 완료 기준이 경로 누락 없는 안전한 종료 처리(`clearTimeout`, `terminate`, `onerror`)에 집중되어 있어, 별도 리뷰 에이전트(Claude)로 교차 검증하는 편이 리스크를 줄였다.
- UI 비블로킹과 실제 런타임 반응은 코드만으로 확정할 수 없어서 antigravity 브라우저 테스트가 필요했다.

## 에이전트 산출물 검증 방법

1. 정적 검증: `pnpm build`로 TypeScript 컴파일/번들 성공 확인
2. Claude 코드 리뷰:
   - `clearTimeout`/`worker.terminate()` 모든 경로 호출 여부
   - 핸들러 등록 순서(`onmessage`/`onerror` 후 `postMessage`)
   - `any` 타입 사용 여부
3. antigravity 브라우저 테스트 3종:
   - 정상 실행: `"안녕" 보여주기` → `{ outputs: ["안녕"] }`
   - 타임아웃: 5초 후 `{ error: 'TIMEOUT' }`, 실행 중 UI 비블로킹 확인
   - 런타임 에러: 한글 에러 메시지 포함 `{ error: 'RUNTIME_ERROR', message: ... }` 확인

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- Claude 리뷰에서 `runWithWorker.ts`의 `onerror` 핸들러가 `ErrorEvent`를 받지 않아 `message`가 유실된 점을 지적했다.
- 교정 지시:
  - `worker.onerror = (event: ErrorEvent) => { ... }`로 타입 명시
  - `resolve({ error: 'RUNTIME_ERROR', message: event.message })`로 메시지 전달
- 교정 후 다시 `pnpm build`와 브라우저 테스트로 회귀 확인했다.

## 기타 발견사항

- 달빛약속 파서는 `반복` 블록 내부에 `반복 그만`이 없으면, 일부 케이스에서 실행 전에 `RUNTIME_ERROR`를 먼저 반환한다.
- 그래서 “무한루프로 타임아웃 유도” 테스트는 빈 반복문 대신 실제 실행 내용을 가진 코드가 필요했다.
- 검증에 사용한 타임아웃 유도 코드:

```text
반복
    1 보여주기
```
