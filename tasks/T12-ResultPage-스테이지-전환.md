# T12 — ResultPage + 스테이지 전환

## 전제 파일 (T11 완료)

- `src/store/gameStore.ts` — `useGameStore()`, `resetGame()`, `nextStage()` import 가능
- `src/data/stageConfig.ts` — `STAGE_CONFIGS` import 가능
- `src/pages/ResultPage.tsx` 빈 스텁 존재, 이 태스크에서 구현
- `src/App.tsx` — `turnPhase` 분기 라우팅 존재 (T01에서 기본 구조 생성됨)

## 목표

게임오버 / 스테이지 클리어 / 게임 클리어 화면을 구현하고, 스테이지 전환 흐름을 완성한다.

## ResultPage 구현

### Props 없이 스토어에서 직접 읽기

```ts
const { turnPhase, stage, enemyName, resetGame, nextStage } = useGameStore()
```

### 화면 분기

**gameover:**
```
GAME OVER
"{enemyName}에게 쓰러졌습니다..."
[다시 시작] → resetGame() 호출
```

**stageclear (스테이지 1):**
```
STAGE CLEAR!
"{enemyName}을 물리쳤습니다!"
[다음 스테이지] → nextStage() 호출
```

**stageclear (스테이지 2, 마지막):**
```
GAME CLEAR!
"모든 적을 물리쳤습니다!"
[처음으로] → resetGame() 호출
```

마지막 스테이지 판단: `stage >= STAGE_CONFIGS.length`

### 디자인 요구사항

- 전체 화면 중앙 정렬
- RPG 던전 테마 유지 (어두운 배경)
- GAME OVER: 빨간 계열, STAGE CLEAR: 황금 계열, GAME CLEAR: 보라 계열
- 버튼 클릭 후 즉시 BattlePage로 전환 (App.tsx의 `turnPhase` 분기에 의해 자동)
- PandaCSS 스타일

## App.tsx 라우팅 완성

```tsx
const { turnPhase } = useGameStore()

if (turnPhase === 'gameover' || turnPhase === 'stageclear') {
  return <ResultPage />
}
return <BattlePage />
```

## 완료 기준

- [ ] `turnPhase === 'gameover'` → GAME OVER 화면
- [ ] `turnPhase === 'stageclear'` + 스테이지 1 → STAGE CLEAR + 다음 스테이지 버튼
- [ ] `turnPhase === 'stageclear'` + 스테이지 2 → GAME CLEAR + 처음으로 버튼
- [ ] [다시 시작] → `resetGame()` → `turnPhase === 'idle'` → BattlePage 복귀
- [ ] [다음 스테이지] → `nextStage()` → `turnPhase === 'idle'` → BattlePage 복귀
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- `STAGE_CONFIGS.length`로 마지막 스테이지 판단하는가 (하드코딩 아닌지)
- `resetGame()` 후 `turnPhase`가 `'idle'`로 복원되는가 (T04 스토어 확인)
- PandaCSS만 사용하는가
- `any` 타입 없는가

## antigravity E2E 테스트 (전체 플로우)

```
[ ] 앱 시작 → BattlePage 렌더링
[ ] 빠른 문제 정답 → 적 HP 감소
[ ] 적 HP 0 → stageclear 화면 전환
[ ] [다음 스테이지] → 스테이지 2 BattlePage
[ ] 플레이어 HP 0 → gameover 화면 전환
[ ] [다시 시작] → 스테이지 1 초기 상태로 리셋
[ ] 스테이지 2 적 HP 0 → GAME CLEAR 화면
[ ] [처음으로] → 스테이지 1 초기 상태로 리셋
```
