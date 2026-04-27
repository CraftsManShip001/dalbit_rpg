# T08 — BattlePage 레이아웃

## 전제 파일 (T07 완료)

- `src/store/gameStore.ts` — `useGameStore()` import 가능
- `src/hooks/useGameEngine.ts` — `startStage()`, `stopStage()` import 가능
- `src/hooks/useQuestionGen.ts` — `currentQuestion`, `pickQuestion()` import 가능
- `src/hooks/useJudge.ts` — `submit()`, `isJudging` import 가능
- `src/pages/BattlePage.tsx` 빈 스텁 존재, 이 태스크에서 구현
- 하위 컴포넌트들(BattleHUD, QuestionPanel, YaksokEditor)은 아직 빈 스텁 — **이 태스크에서는 placeholder로 대체**

## 목표

BattlePage의 전체 레이아웃과 훅 연결, 판정 결과 처리 흐름을 구현한다.
하위 컴포넌트는 아직 미완성이므로 `<div>` placeholder로 대체한다.

## 레이아웃 구조

```
┌─────────────────────────────────────────┐
│  HUD 영역 (placeholder: "HUD")          │
├─────────────────────────────────────────┤
│  문제 영역 (placeholder: "QUESTION")    │
├─────────────────────────────────────────┤
│  에디터 영역 (placeholder: "EDITOR")   │
│  [실행] 버튼                            │
└─────────────────────────────────────────┘
```

## 구현 핵심

### 훅 연결

```ts
const { turnPhase, stage, damagePlayer, damageEnemy, healPlayer, setTurnPhase } = useGameStore()
const { startStage } = useGameEngine()
const { currentQuestion, pickQuestion } = useQuestionGen()
const { submit, isJudging } = useJudge(currentQuestion)
const [code, setCode] = useState('')
```

### 판정 결과 → 스토어 액션 연결

```ts
const handleSubmit = async () => {
  const result = await submit(code)

  // effect 적용
  if (result.effect.type === 'damageEnemy') damageEnemy(result.effect.amount)
  if (result.effect.type === 'healPlayer') healPlayer(result.effect.amount)
  if (result.effect.type === 'damagePlayer') damagePlayer(result.effect.amount)

  setTurnPhase('result')
  // 짧은 딜레이 후 다음 문제
  setTimeout(() => {
    pickQuestion(stage)
    setTurnPhase('questioning')
    setCode('')
  }, 1500)
}
```

### 스테이지 시작

```ts
useEffect(() => {
  if (turnPhase === 'idle') {
    startStage()
    pickQuestion(stage)
  }
}, [])
```

## 요구사항

- PandaCSS `css()` 사용 (인라인 style 금지)
- 3개 영역 세로 배치, 최소 768px 기준 반응형
- 실행 버튼: `isJudging === true` 또는 `turnPhase !== 'questioning'`이면 disabled
- `code` 상태 관리 (에디터 placeholder에 `value={code}` props로 전달 준비)

## 완료 기준

- [ ] 3-패널 레이아웃 렌더링 (placeholder 포함)
- [ ] 스테이지 시작 시 `turnPhase === 'questioning'`
- [ ] 실행 버튼 클릭 → `submit()` 호출 → 스토어 액션 호출 확인
- [ ] `isJudging` 중 버튼 disabled
- [ ] `turnPhase === 'gameover'` 또는 `'stageclear'` → ResultPage로 전환
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- `useJudge`의 `effect`를 BattlePage에서 스토어 액션으로 변환하는가 (useJudge 내부에서 직접 호출 아닌지)
- `setTimeout` cleanup 있는가 (컴포넌트 언마운트 시 clearTimeout)
- PandaCSS만 사용하는가 (인라인 style 없는가)
- `any` 타입 없는가
