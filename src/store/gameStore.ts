import { create } from 'zustand'
import { getFloorConfig, loadBestFloor, saveBestFloor } from '../lib/floorSystem'

export type QuestionType = 'quick' | 'copy' | 'algorithm'

export type TurnPhase = 'idle' | 'questioning' | 'judging' | 'result' | 'gameover'

export type GameScreen = 'home' | 'battle' | 'result'

interface GameState {
  screen: GameScreen
  playerHp: number
  playerMaxHp: number
  enemyHp: number
  enemyMaxHp: number
  enemyName: string
  floor: number
  bestFloor: number
  turnPhase: TurnPhase
  currentQuestionType: QuestionType | null
  damagePlayer: (amount: number) => void
  damageEnemy: (amount: number) => void
  healPlayer: (amount: number) => void
  setTurnPhase: (phase: TurnPhase) => void
  setCurrentQuestionType: (type: QuestionType | null) => void
  startGame: () => void
  goHome: () => void
  advanceFloor: () => void
  endRun: () => void
  nextStage: () => void
  resetGame: () => void
}

const PLAYER_MAX_HP = 100

function createBattleSnapshot(floor: number) {
  const floorConfig = getFloorConfig(floor)

  return {
    playerHp: PLAYER_MAX_HP,
    playerMaxHp: PLAYER_MAX_HP,
    enemyHp: floorConfig.enemyMaxHp,
    enemyMaxHp: floorConfig.enemyMaxHp,
    enemyName: floorConfig.enemyName,
    floor: floorConfig.floor,
  }
}

const INITIAL_BEST_FLOOR = loadBestFloor()

const INITIAL_STATE = {
  ...createBattleSnapshot(1),
  bestFloor: INITIAL_BEST_FLOOR,
  screen: 'home' as const,
  turnPhase: 'idle' as const,
  currentQuestionType: null,
}

export const useGameStore = create<GameState>((set) => ({
  ...INITIAL_STATE,
  damagePlayer: (amount) =>
    set((state) => ({ playerHp: Math.max(0, state.playerHp - amount) })),
  damageEnemy: (amount) =>
    set((state) => ({ enemyHp: Math.max(0, state.enemyHp - amount) })),
  healPlayer: (amount) =>
    set((state) => ({
      playerHp: Math.min(state.playerMaxHp, state.playerHp + amount),
    })),
  setTurnPhase: (phase) => set({ turnPhase: phase }),
  setCurrentQuestionType: (type) => set({ currentQuestionType: type }),
  startGame: () =>
    set((state) => ({
      ...createBattleSnapshot(1),
      bestFloor: state.bestFloor,
      screen: 'battle',
      turnPhase: 'idle',
      currentQuestionType: null,
    })),
  goHome: () =>
    set((state) => ({
      ...createBattleSnapshot(1),
      bestFloor: state.bestFloor,
      screen: 'home',
      turnPhase: 'idle',
      currentQuestionType: null,
    })),
  advanceFloor: () =>
    set((state) => {
      const nextFloor = state.floor + 1
      const nextFloorConfig = getFloorConfig(nextFloor)
      const nextBestFloor = Math.max(state.bestFloor, nextFloor)

      if (nextBestFloor !== state.bestFloor) {
        saveBestFloor(nextBestFloor)
      }

      return {
        floor: nextFloor,
        bestFloor: nextBestFloor,
        enemyHp: nextFloorConfig.enemyMaxHp,
        enemyMaxHp: nextFloorConfig.enemyMaxHp,
        enemyName: nextFloorConfig.enemyName,
        turnPhase: 'idle' as const,
        currentQuestionType: null,
      }
    }),
  endRun: () =>
    set((state) => {
      const nextBestFloor = Math.max(state.bestFloor, state.floor)

      if (nextBestFloor !== state.bestFloor) {
        saveBestFloor(nextBestFloor)
      }

      return {
        turnPhase: 'gameover' as const,
        screen: 'result' as const,
        bestFloor: nextBestFloor,
      }
    }),
  nextStage: () =>
    set((state) => {
      const nextFloor = state.floor + 1
      const nextFloorConfig = getFloorConfig(nextFloor)
      const nextBestFloor = Math.max(state.bestFloor, nextFloor)

      if (nextBestFloor !== state.bestFloor) {
        saveBestFloor(nextBestFloor)
      }

      return {
        floor: nextFloor,
        bestFloor: nextBestFloor,
        enemyHp: nextFloorConfig.enemyMaxHp,
        enemyMaxHp: nextFloorConfig.enemyMaxHp,
        enemyName: nextFloorConfig.enemyName,
        turnPhase: 'idle' as const,
        currentQuestionType: null,
      }
    }),
  resetGame: () =>
    set((state) => ({
      ...createBattleSnapshot(1),
      bestFloor: state.bestFloor,
      screen: 'battle',
      turnPhase: 'idle',
      currentQuestionType: null,
    })),
}))
