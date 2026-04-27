import { useState } from 'react'
import { STAGE_QUESTIONS, type Question } from '../data/questions'
import { getFloorConfig } from '../lib/floorSystem'

type QuestionType = 'quick' | 'copy' | 'algorithm'

function pickQuestionType(weights: { quick: number; copy: number; algorithm: number }): QuestionType {
  const rand = Math.random()

  if (rand < weights.quick) {
    return 'quick'
  }

  if (rand < weights.quick + weights.copy) {
    return 'copy'
  }

  return 'algorithm'
}

export function useQuestionGen() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  const pickQuestion = (floor: number) => {
    const floorConfig = getFloorConfig(floor)
    const questionSet =
      STAGE_QUESTIONS.find((questions) => questions.stage === floorConfig.questionStage) ??
      STAGE_QUESTIONS[STAGE_QUESTIONS.length - 1]

    if (!questionSet) {
      setCurrentQuestion(null)
      return
    }

    const pickedType = pickQuestionType(floorConfig.questionWeights)

    const typePool = questionSet.questions.filter((question) => question.type === pickedType)
    const pool = typePool.length > 0 ? typePool : questionSet.questions

    if (pool.length === 0) {
      setCurrentQuestion(null)
      return
    }

    const pickedQuestion = pool[Math.floor(Math.random() * pool.length)]
    setCurrentQuestion(pickedQuestion)
  }

  return { currentQuestion, pickQuestion }
}
