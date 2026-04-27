import { useEffect, useMemo, useState } from 'react'
import { getFloorConfig } from '../lib/floorSystem'
import { useGameStore } from '../store/gameStore'

export function useGameEngine() {
  const { floor, playerHp, turnPhase, damagePlayer, setTurnPhase, endRun } = useGameStore()
  const floorConfig = useMemo(() => getFloorConfig(floor), [floor])
  const [nextAttackIn, setNextAttackIn] = useState(
    Math.ceil(floorConfig.attackIntervalMs / 1000),
  )
  const [nextAttackRemainingMs, setNextAttackRemainingMs] = useState(
    floorConfig.attackIntervalMs,
  )
  const defaultCountdown = Math.ceil(floorConfig.attackIntervalMs / 1000)

  useEffect(() => {
    setNextAttackIn(Math.ceil(floorConfig.attackIntervalMs / 1000))
    setNextAttackRemainingMs(floorConfig.attackIntervalMs)
  }, [floorConfig.attackIntervalMs])

  useEffect(() => {
    if (turnPhase !== 'questioning') {
      return
    }

    let nextAttackAt = Date.now() + floorConfig.attackIntervalMs

    const tick = () => {
      const remainingMs = nextAttackAt - Date.now()

      if (remainingMs <= 0) {
        damagePlayer(floorConfig.enemyAttack)
        nextAttackAt = Date.now() + floorConfig.attackIntervalMs
        setNextAttackIn(Math.ceil(floorConfig.attackIntervalMs / 1000))
        setNextAttackRemainingMs(floorConfig.attackIntervalMs)
        return
      }

      setNextAttackIn(Math.ceil(remainingMs / 1000))
      setNextAttackRemainingMs(remainingMs)
    }

    const kickoff = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, 200)

    return () => {
      clearTimeout(kickoff)
      clearInterval(interval)
    }
  }, [turnPhase, damagePlayer, floorConfig.attackIntervalMs, floorConfig.enemyAttack])

  useEffect(() => {
    if (playerHp <= 0 && turnPhase !== 'gameover') {
      endRun()
    }
  }, [playerHp, turnPhase, endRun])

  const startStage = () => {
    if (turnPhase === 'gameover') {
      return
    }

    setTurnPhase('questioning')
  }

  return {
    startStage,
    nextAttackIn: turnPhase === 'questioning' ? nextAttackIn : defaultCountdown,
    nextAttackRemainingMs:
      turnPhase === 'questioning' ? Math.max(0, nextAttackRemainingMs) : floorConfig.attackIntervalMs,
    nextAttackTotalMs: floorConfig.attackIntervalMs,
  }
}
