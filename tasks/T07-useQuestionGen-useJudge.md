# T07 — useQuestionGen + useJudge

## 전제 파일 (T06 완료)

- `src/data/stageConfig.ts` — `STAGE_CONFIGS`, `StageConfig` import 가능
- `src/data/questions.ts` — `Question`, `QuickQuestion`, `CopyQuestion`, `AlgorithmQuestion`, `StageQuestions` import 가능
- `src/lib/runWithWorker.ts` — `runWithWorker(code, timeoutMs)` import 가능
- `src/hooks/useQuestionGen.ts` 빈 스텁 존재, 이 태스크에서 구현
- `src/hooks/useJudge.ts` 빈 스텁 존재, 이 태스크에서 구현

## 목표

랜덤 문제 선택 훅과 3유형 판정 훅을 구현한다.
`useJudge`는 판정 결과를 반환만 하고 스토어 액션 직접 호출 금지.

## 구현

### `src/hooks/useQuestionGen.ts`

```ts
import { useState } from 'react'
import { STAGE_CONFIGS } from '../data/stageConfig'
import { STAGE_QUESTIONS } from '../data/questions'
import type { Question } from '../data/questions'

export function useQuestionGen() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  const pickQuestion = (stage: number) => {
    const config = STAGE_CONFIGS.find((c) => c.stage === stage)
    const stageQ = STAGE_QUESTIONS.find((s) => s.stage === stage)
    if (!config || !stageQ) return

    const { quick, copy, algorithm } = config.questionWeights
    const rand = Math.random()

    let type: 'quick' | 'copy' | 'algorithm'
    if (rand < quick) type = 'quick'
    else if (rand < quick + copy) type = 'copy'
    else type = 'algorithm'

    const pool = stageQ.questions.filter((q) => q.type === type)
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setCurrentQuestion(picked)
  }

  return { currentQuestion, pickQuestion }
}
```

### `src/hooks/useJudge.ts`

반환 타입 정의:

```ts
import type { Question } from '../data/questions'
import { runWithWorker } from '../lib/runWithWorker'

export type BattleEffect =
  | { type: 'damageEnemy'; amount: number }
  | { type: 'healPlayer'; amount: number }
  | { type: 'damagePlayer'; amount: number }
  | { type: 'none' }

export type JudgeResult =
  | { verdict: 'correct'; effect: BattleEffect }
  | { verdict: 'wrong'; effect: BattleEffect }
  | { verdict: 'timeout'; effect: BattleEffect }
```

유형별 판정 로직:

**빠른 문제 (quick):**
- `runWithWorker(code, question.timeLimit * 1000)` 실행
- TIMEOUT → `{ verdict: 'timeout', effect: { type: 'none' } }`
- RUNTIME_ERROR → `{ verdict: 'wrong', effect: { type: 'none' } }`
- 출력값 배열 일치 → `{ verdict: 'correct', effect: { type: 'damageEnemy', amount: 30 } }`
- 불일치 → `{ verdict: 'wrong', effect: { type: 'none' } }`

**따라치기 (copy):**
- 런타임 실행 없이 문자열 직접 비교
- normalize: `s.replace(/\r\n/g, '\n').trimEnd()`
- 일치 → `{ verdict: 'correct', effect: { type: 'healPlayer', amount: 20 } }`
- 불일치 → `{ verdict: 'wrong', effect: { type: 'none' } }`

**알고리즘 (algorithm):**
- `runWithWorker(code, question.timeLimit * 1000)` 실행
- TIMEOUT → `{ verdict: 'timeout', effect: { type: 'damagePlayer', amount: question.hpPenalty } }`
- RUNTIME_ERROR → `{ verdict: 'wrong', effect: { type: 'damagePlayer', amount: question.hpPenalty } }`
- 출력값 일치 → `{ verdict: 'correct', effect: { type: 'damageEnemy', amount: 80 } }`
- 불일치 → `{ verdict: 'wrong', effect: { type: 'damagePlayer', amount: question.hpPenalty } }`

훅 인터페이스:

```ts
export function useJudge(currentQuestion: Question | null) {
  const [isJudging, setIsJudging] = useState(false)

  const submit = async (code: string): Promise<JudgeResult> => {
    if (!currentQuestion) throw new Error('문제가 없습니다')
    setIsJudging(true)
    try {
      // 유형별 판정 로직
    } finally {
      setIsJudging(false)
    }
  }

  return { submit, isJudging }
}
```

**중요: `submit` 내부에서 `useGameStore` 직접 호출 금지. 결과 반환 → 호출자(`BattlePage`)가 스토어 액션 호출.**

## 완료 기준

- [ ] `pickQuestion(1)` → `currentQuestion` 설정됨, 유형이 가중치 범위 내
- [ ] quick 정답 코드 → `verdict: 'correct'`, `effect.type === 'damageEnemy'`
- [ ] quick 오답 코드 → `verdict: 'wrong'`, `effect.type === 'none'`
- [ ] copy 완전 일치 → `verdict: 'correct'`
- [ ] copy 한 글자 다름 → `verdict: 'wrong'`
- [ ] algorithm 정답 → `verdict: 'correct'`, `effect.type === 'damageEnemy'`
- [ ] algorithm 오답 → `verdict: 'wrong'`, `effect.type === 'damagePlayer'`
- [ ] `isJudging` — submit 중 true, 완료 후 false
- [ ] `any` 타입 없음

## Claude 코드 리뷰 체크리스트

- `useJudge`가 `useGameStore` 직접 호출하지 않는가 (effect 반환만 하는가)
- `isJudging`이 에러 발생 시에도 false로 복원되는가 (`finally` 사용)
- `BattleEffect` discriminated union 모든 케이스 커버하는가
- 따라치기 `\r\n` normalize 있는가
- `any` 타입 없는가
