import { ENEMY_ROTATION, STAGE_CONFIGS, type StageConfig } from '../data/stageConfig'

const BEST_FLOOR_STORAGE_KEY = 'dalbit-rpg-best-floor'

interface QuestionWeights {
  quick: number
  copy: number
  algorithm: number
}

export interface FloorConfig {
  floor: number
  enemyName: string
  enemyMaxHp: number
  enemyAttack: number
  attackIntervalMs: number
  questionWeights: QuestionWeights
  questionStage: number
}

function normalizeFloor(floor: number): number {
  if (!Number.isFinite(floor)) {
    return 1
  }

  return Math.max(1, Math.floor(floor))
}

function getBaseStageConfig(floor: number): StageConfig {
  if (floor <= 3) {
    return STAGE_CONFIGS[0]
  }

  return STAGE_CONFIGS[STAGE_CONFIGS.length - 1]
}

function getQuestionStage(floor: number): number {
  return floor <= 3 ? 1 : 2
}

function getQuestionWeights(floor: number): QuestionWeights {
  const base = getBaseStageConfig(floor).questionWeights
  const algorithmBoost = Math.min(0.35, (floor - 1) * 0.02)

  const quick = Math.max(0.2, base.quick - algorithmBoost * 0.7)
  const copy = Math.max(0.2, base.copy - algorithmBoost * 0.3)
  const algorithm = Math.min(0.6, base.algorithm + algorithmBoost)

  const total = quick + copy + algorithm

  return {
    quick: quick / total,
    copy: copy / total,
    algorithm: algorithm / total,
  }
}

export function getFloorConfig(floor: number): FloorConfig {
  const normalizedFloor = normalizeFloor(floor)
  const baseConfig = getBaseStageConfig(normalizedFloor)
  const enemyName = ENEMY_ROTATION[(normalizedFloor - 1) % ENEMY_ROTATION.length]

  const enemyMaxHp = Math.round(baseConfig.enemyMaxHp + (normalizedFloor - 1) * 22)
  const enemyAttack = Math.round(baseConfig.enemyAttack + (normalizedFloor - 1) * 2)
  const attackIntervalMs = Math.max(3500, baseConfig.attackIntervalMs - (normalizedFloor - 1) * 220)

  return {
    floor: normalizedFloor,
    enemyName,
    enemyMaxHp,
    enemyAttack,
    attackIntervalMs,
    questionWeights: getQuestionWeights(normalizedFloor),
    questionStage: getQuestionStage(normalizedFloor),
  }
}

export function loadBestFloor(): number {
  if (typeof window === 'undefined') {
    return 1
  }

  let storedValue: string | null = null

  try {
    storedValue = window.localStorage.getItem(BEST_FLOOR_STORAGE_KEY)
  } catch {
    return 1
  }

  if (!storedValue) {
    return 1
  }

  const parsedValue = Number(storedValue)
  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1
  }

  return Math.floor(parsedValue)
}

export function saveBestFloor(floor: number): void {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedFloor = normalizeFloor(floor)

  try {
    window.localStorage.setItem(BEST_FLOOR_STORAGE_KEY, String(normalizedFloor))
  } catch {
    return
  }
}
