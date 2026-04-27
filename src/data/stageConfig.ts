export interface StageConfig {
  stage: number
  enemyMaxHp: number
  enemyAttack: number
  attackIntervalMs: number
  questionWeights: {
    quick: number
    copy: number
    algorithm: number
  }
}

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 1,
    enemyMaxHp: 100,
    enemyAttack: 10,
    attackIntervalMs: 10000,
    questionWeights: {
      quick: 0.6,
      copy: 0.35,
      algorithm: 0.05,
    },
  },
  {
    stage: 2,
    enemyMaxHp: 150,
    enemyAttack: 15,
    attackIntervalMs: 8000,
    questionWeights: {
      quick: 0.5,
      copy: 0.3,
      algorithm: 0.2,
    },
  },
]

export const ENEMY_ROTATION = [
  '슬라임',
  '고블린',
  '오크',
  '와이번',
  '마왕',
  '가고일',
  '네크로맨서',
  '문노터',
] as const
