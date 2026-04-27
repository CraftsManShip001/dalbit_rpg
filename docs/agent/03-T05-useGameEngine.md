# T05 — useGameEngine

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [ ] antigravity
- [ ] 직접

## 에이전트에게 위임한 작업의 범위

- Codex에 `src/hooks/useGameEngine.ts` 구현을 위임했다.
- `questioning` phase에서만 적 자동 공격 타이머가 동작하도록 `useEffect`를 구성했다.
- phase 변경 또는 컴포넌트 언마운트 시 `clearInterval` cleanup이 항상 실행되도록 했다.
- HP 감지 로직을 훅에서 담당하도록 분리해 `playerHp <= 0`이면 `gameover`, `enemyHp <= 0`이면 `stageclear`로 전환하도록 했다.
- 외부 호출용 `startStage`, `stopStage` 액션을 제공했다.
- T06 이전 단계 기준에 맞춰 `stageConfig`는 참조하지 않고 `TEMP_STAGE_CONFIG` 하드코딩 값을 사용했다.

## 위임 판단 근거

- T05는 React 훅 생명주기(`useEffect` 의존성/cleanup)와 상태 전환 책임 분리가 핵심이라 구현 패턴이 명확했다.
- 리스크가 타이머 누수, phase 조건 누락, HP 0 전환 누락에 집중되어 있어 Codex로 빠르게 구현하고 Claude 리뷰로 체크리스트를 교차 검증하는 방식이 효율적이었다.
- `stageConfig` 연동은 T06 이후 범위이므로, 이번 태스크에서는 임시 하드코딩을 의도적으로 유지하는 것이 명세와 일치했다.

## 에이전트 산출물 검증 방법

1. 코드 기준 검증:
   - `turnPhase === 'questioning'` 조건에서만 `setInterval` 생성되는지 확인
   - `useEffect` cleanup에 `clearInterval`이 포함되어 phase 전환/언마운트 시 중단되는지 확인
   - `playerHp <= 0` → `setTurnPhase('gameover')` 확인
   - `enemyHp <= 0` → `setTurnPhase('stageclear')` 확인
   - `startStage`, `stopStage` 액션 반환 확인
2. 정적 검증:
   - `npm run lint` 통과 확인
   - `npm run build` 통과 확인
3. 리뷰 검증:
   - Claude 코드 리뷰 체크리스트 전 항목 통과 확인

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- 없음.
- 이번 T05에서는 Codex 산출물이 요구사항과 일치했고, Claude 코드 리뷰에서도 별도 교정 요청이 발생하지 않았다.
