# T05 — useGameEngine

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [ ] antigravity
- [ ] 직접

## 에이전트에게 위임한 작업의 범위

- `src/hooks/useGameEngine.ts` 구현
- `turnPhase === 'questioning'` 동안만 적 자동 공격 타이머 동작
- 다음 공격까지 남은 시간(`nextAttackIn`, `nextAttackRemainingMs`) 상태 제공
- 층별 설정(`getFloorConfig`) 기반으로 공격 주기/피해량 반영
- `playerHp <= 0` 감지 시 `endRun()` 호출

## 위임 판단 근거

타이머 훅은 cleanup 누락 시 치명적인 버그가 쉽게 발생한다.
구조는 명확하므로 에이전트 구현 후 의존성/cleanup을 집중 리뷰하는 방식이 안정적이었다.

## 에이전트 산출물 검증 방법

1. 타이머 생명주기 검증
- `questioning`에서만 interval 생성
- phase 변경/언마운트 시 `clearTimeout`, `clearInterval` 실행

2. 수치 반영 검증
- 층 상승 시 공격 주기/피해량이 `floorSystem` 값으로 갱신되는지 확인

3. 런 종료 검증
- `playerHp <= 0` 시 `screen='result'`로 전환되는지 확인

4. 정적 검증
- `pnpm build` 통과

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- 과거 문서 기준의 `stopStage`, `stageclear` 전환 서술은 현재 구조와 맞지 않아 제거했다.
- 현재 훅 책임은 "적 공격 타이머 + 플레이어 사망 감지"로 고정했다.
