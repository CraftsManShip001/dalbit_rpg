# T08 — BattlePage 레이아웃

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [x] antigravity
- [x] 직접

## 에이전트에게 위임한 작업의 범위

- Codex에 `src/pages/BattlePage.tsx` 구현을 위임했다.
- `useGameStore`, `useGameEngine`, `useQuestionGen`, `useJudge`를 연결하고, 전투 흐름 제어를 BattlePage에서 통합하도록 맡겼다.
- `turnPhase === 'idle'`일 때 `startStage()` + `pickQuestion()` 실행 로직을 구현하도록 했다.
- `submit(code)` 결과의 `effect`를 BattlePage에서 스토어 액션(`damageEnemy`, `healPlayer`, `damagePlayer`)으로 변환하도록 했다.
- `result` phase 후 1.5초 뒤 다음 문제 선택, `questioning` 복귀, 코드 초기화까지 맡겼다.
- `setTimeout`/`clearTimeout` cleanup 처리와 PandaCSS 기반 3패널 세로 레이아웃(HUD/QUESTION/EDITOR), 실행 버튼 disabled 조건(`isJudging || turnPhase !== 'questioning' || !currentQuestion`)을 포함해 구현하도록 했다.
- `turnPhase`가 `gameover` 또는 `stageclear`일 때 `ResultPage` 전환까지 위임했다.

## 위임 판단 근거

- T08은 UI 레이아웃과 훅 연결, 상태 전환 타이밍을 정확히 조합하는 작업이라 구현 속도와 일관성 측면에서 Codex 위임 효율이 높았다.
- 반면 전투 판정 결과를 스토어 액션으로 매핑하는 부분은 게임 규칙 회귀 위험이 있어, 구현은 위임하되 Claude 리뷰와 브라우저 검증을 전제로 진행했다.
- 명세가 구체적(버튼 비활성 조건, phase 전환, cleanup 요구)이라 수용 기준을 체크리스트 형태로 검증하기 적합했다.

## 에이전트 산출물 검증 방법

1. 정적 검증:
   `pnpm build`, `pnpm lint` 실행으로 TypeScript 컴파일/린트 통과를 확인했다.
2. 코드 리뷰:
   Claude 코드 리뷰로 T08 체크리스트(스토어 액션 변환 위치, setTimeout cleanup, PandaCSS 사용, `any` 금지) 통과를 확인했다.
3. 브라우저 검증:
   antigravity 브라우저 테스트 전 항목 통과를 확인했다.
4. 구현 산출물 확인:
   `src/pages/BattlePage.tsx`에서 idle 시작, submit 후 result→questioning 복귀, disabled 조건, gameover/stageclear 전환 코드가 반영됐는지 확인했다.

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- 없음.
- 이번 태스크에서는 명세와 구현 결과가 일치해 추가 교정 요청 없이 완료했다.
