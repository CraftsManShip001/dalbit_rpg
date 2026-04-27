# T07 — useQuestionGen + useJudge

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [ ] antigravity
- [x] 직접

## 에이전트에게 위임한 작업의 범위

- `useQuestionGen`: 층 가중치(`quick/copy/algorithm`) 기반 유형 선택 + 랜덤 문제 선택
- `useJudge`: 유형별 판정 및 effect 생성
- `judgeTimeout()` 분리로 문제 시간 만료 자동 판정 지원

## 위임 판단 근거

분기 규칙이 명확한 로직성 태스크라 에이전트 위임 효율이 높았다.
대신 판정 결과가 전투 밸런스에 직접 영향이 커서 경로별 검증을 강화했다.

## 에이전트 산출물 검증 방법

1. `useQuestionGen` 검증
- `floorSystem`의 `questionWeights`, `questionStage` 반영 확인

2. `useJudge` 검증
- `copy`: normalize 후 문자열 일치 판정
- `quick/algorithm`: Worker 결과 분기(`TIMEOUT`, `RUNTIME_ERROR`, 출력 비교)
- 오답/타임아웃 시 현재 규칙에 맞는 HP 패널티 부여 확인

3. 안정성 검증
- `isJudging`가 `finally`에서 항상 복구되는지 확인
- `useGameStore` 직접 호출 없이 `JudgeResult`만 반환하는지 확인

4. 정적 검증
- `pnpm build` 통과

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- `RUNTIME_ERROR` 분기 누락 및 패널티 정책 불일치 이슈를 리뷰에서 교정했다.
- 현재 구현은 에러 경로를 모두 명시 분기로 처리한다.
