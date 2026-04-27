# T07 — useQuestionGen + useJudge

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [ ] antigravity
- [x] 직접

## 에이전트에게 위임한 작업의 범위

- Codex에 `src/hooks/useQuestionGen.ts`, `src/hooks/useJudge.ts` 구현을 위임했다.
- `useQuestionGen`은 스테이지 가중치(`quick/copy/algorithm`) 기반 누적 확률 구간으로 문제 유형을 결정하고, 해당 풀에서 랜덤 문제를 선택하도록 구현을 맡겼다.
- `useJudge`는 `BattleEffect`/`JudgeResult` discriminated union 정의와 유형별 판정 로직 구현을 맡겼다.
- 판정 세부 범위:
  - `copy`: `\r\n` normalize + `trimEnd()` 후 문자열 비교
  - `quick`/`algorithm`: `runWithWorker` 기반 `TIMEOUT`/`RUNTIME_ERROR`/출력 일치 분기
  - `isJudging`는 `finally`에서 항상 `false` 복원
  - `useGameStore` 직접 호출 없이 결과만 반환

## 위임 판단 근거

- T07은 문제 선택/판정의 분기 규칙이 명세로 명확하게 주어져 있어, 에이전트가 구조화된 조건 분기를 빠르게 구현하기에 적합했다.
- 다만 전투 결과에 직접 영향이 있는 로직이므로, 리뷰를 통한 교차 검증(Claude)과 빌드/린트 재검증을 전제 조건으로 두고 진행했다.
- 스토어 결합 금지, `any` 금지, `finally` 복원 같은 품질 조건이 명확해서 위임 후 수용 기준 관리가 용이했다.

## 에이전트 산출물 검증 방법

1. 코드 리뷰:
   Claude 리뷰로 T07 체크리스트를 검증했다.
2. 교정 반영 확인:
   지적된 `RUNTIME_ERROR` 누락을 명시적 분기로 수정했는지 확인했다.
   - algorithm 분기: `src/hooks/useJudge.ts` L66
   - quick 분기: `src/hooks/useJudge.ts` L89
3. 정적 검증:
   `pnpm build`, `pnpm lint`를 실행해 컴파일/린트 통과를 확인했다.
4. 아키텍처 검증:
   `useJudge`가 `useGameStore`를 직접 호출하지 않고 `JudgeResult`만 반환하는지 확인했다.

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- Claude 코드 리뷰에서 `RUNTIME_ERROR`가 fallthrough로만 처리되는 문제를 발견했다.
- 교정 지시:
  `TIMEOUT` 이후 암묵 처리 대신 `result.error === 'RUNTIME_ERROR'` 명시 `if` 분기를 quick/algorithm 양쪽에 추가하도록 수정 요청했다.
- 교정 결과:
  명시 분기 반영 후 `pnpm build`, `pnpm lint` 재실행까지 통과했다.

## 기타 발견사항

- `shield` BattleEffect 누락 지적이 있었으나, 현재 T07 명세는 copy 성공 효과를 `healPlayer`로 정의하고 있어 우선 스펙 준수로 유지했다.
- `shield`는 T10 이후 UI/스토어 효과 체계 확장 시점에 필요하면 별도 태스크로 반영하기로 결정했다.
