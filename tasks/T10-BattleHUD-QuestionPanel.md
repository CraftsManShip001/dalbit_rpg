# T10 — BattleHUD + QuestionPanel

## 전제 파일 (T09 완료)

- `src/store/gameStore.ts` — `useGameStore()` import 가능
- `src/data/questions.ts` — `Question` 타입 import 가능
- `src/components/game/BattleHUD.tsx` 빈 스텁 존재
- `src/components/game/QuestionPanel.tsx` 빈 스텁 존재
- `src/components/ui/HealthBar.tsx` 빈 스텁 존재

## 목표

전투 화면 상단 HUD와 문제 패널을 구현한다.

## BattleHUD

### Props

```ts
interface BattleHUDProps {
  playerHp: number
  playerMaxHp: number
  enemyHp: number
  enemyMaxHp: number
  enemyName: string
  nextAttackIn: number  // 초 단위 카운트다운 (useGameEngine에서 내려줌)
}
```

### 요구사항

- 플레이어 HP바: 녹색, `HealthBar` 컴포넌트 재사용
- 적 HP바: 빨간색, `HealthBar` 컴포넌트 재사용
- HP바: `width: ${(hp / maxHp) * 100}%` CSS transition 0.3s ease-out
- 공격 카운트다운: 숫자 표시, 5초 이하이면 빨간색 + 깜빡임 (CSS animation)
- PandaCSS 스타일

### HealthBar 컴포넌트 (`src/components/ui/HealthBar.tsx`)

```ts
interface HealthBarProps {
  current: number
  max: number
  color: 'green' | 'red'
}
```

## QuestionPanel

### Props

```ts
interface QuestionPanelProps {
  question: Question
  timeRemaining: number
  totalTime: number
}
```

### 요구사항

- 유형 배지:
  - `quick` → 파란색 "⚡ 빠른 문제"
  - `copy` → 보라색 "📋 따라치기"
  - `algorithm` → 황금색 "💥 알고리즘"
- 타이머바: `width: ${(timeRemaining / totalTime) * 100}%` 감소
  - 30% 이하 → 빨간색으로 전환
- `quick` / `algorithm`: 문제 설명 텍스트 표시
- `copy`: `codeToType` 코드 블록으로 표시 (monospace, 배경 구분)
- PandaCSS 스타일

## 완료 기준

- [ ] HP바 퍼센트 반영 + CSS transition
- [ ] 카운트다운 5초 이하 깜빡임
- [ ] 유형별 배지 색상 구분
- [ ] 타이머바 30% 이하 빨간색
- [ ] 따라치기 코드 블록 표시 (monospace)
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- HP 0일 때 HP바 width가 음수가 되지 않는가 (`Math.max(0, ...)`)
- `question.type`으로 분기 시 모든 케이스 커버하는가 (exhaustive check)
- PandaCSS만 사용하는가
- `any` 타입 없는가

## antigravity 브라우저 테스트

```
[ ] HP바 — 100% / 50% / 0% 각각 렌더링 확인
[ ] 카운트다운 4초 → 빨간 깜빡임
[ ] 유형 배지 3가지 색상 구분 확인
[ ] 타이머바 20% → 빨간색 전환
[ ] 따라치기 코드 블록 monospace 표시
```
