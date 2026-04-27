# T10 — BattleHUD + QuestionPanel

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [x] antigravity
- [ ] 직접

## 에이전트에게 위임한 작업의 범위

- Codex에 `src/components/ui/HealthBar.tsx` 구현을 위임했다.
- `HealthBar`에서 `current/max` 비율을 clamp 처리하고, `width` 전환(`0.3s ease-out`) 및 `green/red` 색상 분기를 반영하도록 맡겼다.
- Codex에 `src/components/game/BattleHUD.tsx` 구현을 위임했다.
- 플레이어/적 HP바 렌더링(`HealthBar` 재사용), `nextAttackIn` 카운트다운 표시, 5초 이하 경고(빨간색 + `blink` 애니메이션) 구현까지 맡겼다.
- Codex에 `src/components/game/QuestionPanel.tsx` 구현을 위임했다.
- 유형 배지 3종(`quick/copy/algorithm`) 색상 분기, 타이머바 30% 이하 빨간색 전환, `copy` 코드 블록 monospace 표시, `assertNever` 기반 exhaustive check를 포함하도록 했다.
- `src/hooks/useGameEngine.ts`를 stageConfig 기반 타이머로 교체하고 `nextAttackIn` 상태 반환을 추가하도록 위임했다.
- `src/pages/BattlePage.tsx`에서 HUD/QUESTION placeholder를 `BattleHUD`, `QuestionPanel`로 교체하고, `timeRemaining` 타이머 연결까지 맡겼다.

## 위임 판단 근거

- T10은 UI 컴포넌트 구현(HP바/배지/타이머바)과 훅 연결(`useGameEngine`/`BattlePage`)이 동시에 필요한 작업으로, 명세가 구체적이라 Codex에 일괄 위임하기 적합했다.
- 리스크 포인트는 타이머 계산 경계값(0% 이하 방지), 유형 분기 누락, 애니메이션 조건 분기라서 구현 후 Claude 리뷰로 안정성을 확인하는 방식이 효율적이었다.
- 시각 요구사항 비중이 높아 정적 검증만으로는 부족하므로 antigravity 브라우저 테스트를 필수 검증 단계로 두고 진행했다.

## 에이전트 산출물 검증 방법

1. 정적 검증:
   `pnpm build`, `pnpm lint`를 실행해 컴파일/린트 통과를 확인했다.
2. 코드 리뷰:
   Claude 코드 리뷰로 T10 체크리스트(HP clamp, exhaustive check, PandaCSS 사용, `any` 금지) 통과를 확인했다.
3. 브라우저 검증:
   antigravity 브라우저 테스트 전 항목(HP바 100/50/0, 카운트다운 4초 깜빡임, 유형 배지 3종, 타이머바 20% 빨간색, copy 코드 블록 monospace) 통과를 확인했다.
4. 구현 산출물 확인:
   `HealthBar`, `BattleHUD`, `QuestionPanel`, `useGameEngine`, `BattlePage` 변경사항이 실제 요구사항과 일치하는지 파일 단위로 점검했다.

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- 없음.
- 이번 T10은 구현과 검증 결과가 명세와 일치해 추가 교정 없이 완료했다.
