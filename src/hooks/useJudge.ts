import { useState } from 'react'
import type { Question } from '../data/questions'
import { runWithWorker } from '../lib/runWithWorker'

export type BattleEffect =
  | { type: 'damageEnemy'; amount: number }
  | { type: 'healPlayer'; amount: number }
  | { type: 'damagePlayer'; amount: number }
  | { type: 'none' }

export interface JudgeRunInfo {
  note: string
  outputLines: string[]
  expectedLines: string[]
  errorMessage: string | null
}

export type JudgeResult =
  | { verdict: 'correct'; effect: BattleEffect; runInfo: JudgeRunInfo }
  | { verdict: 'wrong'; effect: BattleEffect; runInfo: JudgeRunInfo }
  | { verdict: 'timeout'; effect: BattleEffect; runInfo: JudgeRunInfo }

const WRONG_PENALTY = 6
const TIMEOUT_PENALTY = 8

const normalizeCode = (source: string): string =>
  source.replace(/\r\n/g, '\n').trimEnd()

const isOutputsMatched = (actual: string[], expected: string[]): boolean => {
  if (actual.length !== expected.length) {
    return false
  }

  return actual.every((line, index) => line === expected[index])
}

export function useJudge(currentQuestion: Question | null) {
  const [isJudging, setIsJudging] = useState(false)

  const judgeTimeout = (): JudgeResult => {
    if (!currentQuestion) {
      throw new Error('문제가 없습니다')
    }

    if (currentQuestion.type === 'algorithm') {
      return {
        verdict: 'wrong',
        effect: { type: 'damagePlayer', amount: currentQuestion.hpPenalty },
        runInfo: {
          note: '시간 종료! 알고리즘 문제 패널티를 받았습니다.',
          outputLines: [],
          expectedLines: currentQuestion.expectedOutputs,
          errorMessage: 'TIME_LIMIT_EXCEEDED',
        },
      }
    }

    return {
      verdict: 'wrong',
      effect: { type: 'damagePlayer', amount: TIMEOUT_PENALTY },
      runInfo: {
        note: '시간 종료! 오답 처리되어 체력이 감소했습니다.',
        outputLines: [],
        expectedLines: currentQuestion.type === 'copy' ? [] : currentQuestion.expectedOutputs,
        errorMessage: 'TIME_LIMIT_EXCEEDED',
      },
    }
  }

  const submit = async (code: string): Promise<JudgeResult> => {
    if (!currentQuestion) {
      throw new Error('문제가 없습니다')
    }

    setIsJudging(true)

    try {
      if (currentQuestion.type === 'copy') {
        const isCorrect =
          normalizeCode(code) === normalizeCode(currentQuestion.codeToType)

        if (isCorrect) {
          return {
            verdict: 'correct',
            effect: { type: 'healPlayer', amount: 20 },
            runInfo: {
              note: '따라치기 성공! 체력이 회복됩니다.',
              outputLines: [],
              expectedLines: [],
              errorMessage: null,
            },
          }
        }

        return {
          verdict: 'wrong',
          effect: { type: 'damagePlayer', amount: WRONG_PENALTY },
          runInfo: {
            note: '따라치기 실패! 공백/줄바꿈까지 완전히 동일해야 합니다. 체력이 감소했습니다.',
            outputLines: [],
            expectedLines: [],
            errorMessage: null,
          },
        }
      }

      const result = await runWithWorker(code, currentQuestion.timeLimit * 1000)

      if ('error' in result) {
        if (currentQuestion.type === 'algorithm') {
          if (result.error === 'TIMEOUT') {
            return {
              verdict: 'timeout',
              effect: {
                type: 'damagePlayer',
                amount: currentQuestion.hpPenalty,
              },
              runInfo: {
                note: '시간 초과로 패널티 피해를 받았습니다.',
                outputLines: [],
                expectedLines: currentQuestion.expectedOutputs,
                errorMessage: 'TIMEOUT',
              },
            }
          }

          if (result.error === 'RUNTIME_ERROR') {
            return {
              verdict: 'wrong',
              effect: {
                type: 'damagePlayer',
                amount: currentQuestion.hpPenalty,
              },
              runInfo: {
                note: '런타임 오류로 패널티 피해를 받았습니다.',
                outputLines: [],
                expectedLines: currentQuestion.expectedOutputs,
                errorMessage: result.message ?? 'RUNTIME_ERROR',
              },
            }
          }

          return {
            verdict: 'wrong',
            effect: {
              type: 'damagePlayer',
              amount: currentQuestion.hpPenalty,
            },
            runInfo: {
              note: '오답으로 패널티 피해를 받았습니다.',
              outputLines: [],
              expectedLines: currentQuestion.expectedOutputs,
              errorMessage: result.message ?? result.error,
            },
          }
        }

        if (result.error === 'TIMEOUT') {
          return {
            verdict: 'timeout',
            effect: { type: 'damagePlayer', amount: TIMEOUT_PENALTY },
            runInfo: {
              note: '시간 초과로 오답 처리되어 체력이 감소했습니다.',
              outputLines: [],
              expectedLines: currentQuestion.expectedOutputs,
              errorMessage: 'TIMEOUT',
            },
          }
        }

        if (result.error === 'RUNTIME_ERROR') {
          return {
            verdict: 'wrong',
            effect: { type: 'damagePlayer', amount: WRONG_PENALTY },
            runInfo: {
              note: '런타임 오류로 오답 처리되어 체력이 감소했습니다.',
              outputLines: [],
              expectedLines: currentQuestion.expectedOutputs,
              errorMessage: result.message ?? 'RUNTIME_ERROR',
            },
          }
        }

        return {
          verdict: 'wrong',
          effect: { type: 'damagePlayer', amount: WRONG_PENALTY },
          runInfo: {
            note: '실행 오류로 오답 처리되어 체력이 감소했습니다.',
            outputLines: [],
            expectedLines: currentQuestion.expectedOutputs,
            errorMessage: result.message ?? result.error,
          },
        }
      }

      if (isOutputsMatched(result.outputs, currentQuestion.expectedOutputs)) {
        if (currentQuestion.type === 'algorithm') {
          return {
            verdict: 'correct',
            effect: { type: 'damageEnemy', amount: 80 },
            runInfo: {
              note: '정답! 강력한 공격이 발동했습니다.',
              outputLines: result.outputs,
              expectedLines: currentQuestion.expectedOutputs,
              errorMessage: null,
            },
          }
        }

        return {
          verdict: 'correct',
          effect: { type: 'damageEnemy', amount: 30 },
          runInfo: {
            note: '정답! 공격 성공!',
            outputLines: result.outputs,
            expectedLines: currentQuestion.expectedOutputs,
            errorMessage: null,
          },
        }
      }

      if (currentQuestion.type === 'algorithm') {
        return {
          verdict: 'wrong',
          effect: { type: 'damagePlayer', amount: currentQuestion.hpPenalty },
          runInfo: {
            note: '출력이 다릅니다. 알고리즘 문제 패널티를 받았습니다.',
            outputLines: result.outputs,
            expectedLines: currentQuestion.expectedOutputs,
            errorMessage: null,
          },
        }
      }

      return {
        verdict: 'wrong',
        effect: { type: 'damagePlayer', amount: WRONG_PENALTY },
        runInfo: {
          note: '출력이 정답과 달라 오답 처리되었습니다. 체력이 감소했습니다.',
          outputLines: result.outputs,
          expectedLines: currentQuestion.expectedOutputs,
          errorMessage: null,
        },
      }
    } finally {
      setIsJudging(false)
    }
  }

  return { submit, judgeTimeout, isJudging }
}
