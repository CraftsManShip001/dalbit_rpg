# T05 — useGameEngine

## 전제 파일 (T04 완료)

- `src/store/gameStore.ts` 구현 완료. `useGameStore()` import 가능
- `src/hooks/useGameEngine.ts` 빈 스텁 존재, 이 태스크에서 구현
- `src/data/stageConfig.ts` 아직 빈 스텁 — 이 태스크에서는 아래 임시 하드코딩 사용:

```ts
const TEMP_STAGE_CONFIG = {
  enemyAttack: 10,
  attackIntervalMs: 10000,
}
```

## 목표

적 자동 공격 타이머와 HP 변화 감지 → 게임 상태 전환을 담당하는 훅을 구현한다.

## 구현

`src/hooks/useGameEngine.ts`:

```ts
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const TEMP_STAGE_CONFIG = {
  enemyAttack: 10,
  attackIntervalMs: 10000,
}

export function useGameEngine() {
  const { playerHp, enemyHp, turnPhase, damagePlayer, setTurnPhase } =
    useGameStore()

  // 적 자동 공격 타이머 — questioning phase에서만 동작
  useEffect(() => {
    if (turnPhase !== 'questioning') return

    const interval = setInterval(() => {
      damagePlayer(TEMP_STAGE_CONFIG.enemyAttack)
    }, TEMP_STAGE_CONFIG.attackIntervalMs)

    return () => clearInterval(interval)
  }, [turnPhase, damagePlayer])

  // HP 0 감지 → 상태 전환
  useEffect(() => {
    if (playerHp <= 0) setTurnPhase('gameover')
  }, [playerHp, setTurnPhase])

  useEffect(() => {
    if (enemyHp <= 0) setTurnPhase('stageclear')
  }, [enemyHp, setTurnPhase])

  const startStage = () => setTurnPhase('questioning')
  const stopStage = () => setTurnPhase('idle')

  return { startStage, stopStage }
}
```

### 핵심 규칙

- 타이머는 `questioning` phase에서만 동작. `judging`, `result` phase에서 자동 중단
- `useEffect` cleanup (`return () => clearInterval(...)`) 반드시 존재
- `gameover` / `stageclear` 전환을 스토어 액션에서 하지 않고 여기서 담당

## 완료 기준

- [ ] `startStage()` 호출 → `turnPhase === 'questioning'`
- [ ] `questioning` phase → N초 후 `playerHp` 감소 확인
- [ ] `turnPhase`가 `judging`으로 바뀌면 타이머 중단
- [ ] `playerHp === 0` → `turnPhase === 'gameover'`
- [ ] `enemyHp === 0` → `turnPhase === 'stageclear'`
- [ ] 컴포넌트 언마운트 시 타이머 cleanup (메모리 누수 없음)

## Claude 코드 리뷰 체크리스트

- `useEffect` cleanup 있는가 (`return () => clearInterval(...)`)
- 의존성 배열 올바른가 (eslint-plugin-react-hooks 기준)
- `any` 타입 없는가
- HP 0 감지 `useEffect`가 `playerHp`가 이미 0인 상태에서 재마운트될 때도 동작하는가
