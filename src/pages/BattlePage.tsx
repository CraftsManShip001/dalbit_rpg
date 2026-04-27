import { useCallback, useEffect, useRef, useState } from 'react'
import { css } from '../../styled-system/css'
import BattleHUD from '../components/game/BattleHUD'
import DamagePopup, { type DamagePopup as DamagePopupState } from '../components/game/DamagePopup'
import JudgeFeedback from '../components/game/JudgeFeedback'
import QuestionPanel from '../components/game/QuestionPanel'
import YaksokEditor from '../components/game/YaksokEditor'
import { useGameEngine } from '../hooks/useGameEngine'
import { useJudge, type JudgeResult, type JudgeRunInfo } from '../hooks/useJudge'
import { useQuestionGen } from '../hooks/useQuestionGen'
import { useGameStore } from '../store/gameStore'

const POPUP_DURATION_MS = 800
const FEEDBACK_DURATION_MS = 1500
const SHAKE_DURATION_MS = 500
const EFFECT_BANNER_DURATION_MS = 900

const sectionTitleClassName = css({
  m: '0',
  fontFamily: 'title',
  fontWeight: 'black',
  fontSize: { base: '3xl', md: '4xl' },
  lineHeight: 'tight',
  color: '#6A67EB',
  transform: 'skewX(-10deg)',
  letterSpacing: '-0.02em',
})

type ActionEffect = 'attack' | 'heal'

export default function BattlePage() {
  const {
    turnPhase,
    floor,
    playerHp,
    playerMaxHp,
    enemyHp,
    enemyMaxHp,
    enemyName,
    damagePlayer,
    damageEnemy,
    healPlayer,
    setTurnPhase,
    advanceFloor,
  } = useGameStore()

  const { startStage, nextAttackIn, nextAttackRemainingMs, nextAttackTotalMs } = useGameEngine()
  const { currentQuestion, pickQuestion } = useQuestionGen()
  const { submit, judgeTimeout, isJudging } = useJudge(currentQuestion)

  const [code, setCode] = useState('')
  const [timeRemainingMs, setTimeRemainingMs] = useState(0)
  const [editorFocusTrigger, setEditorFocusTrigger] = useState(0)
  const [damagePopups, setDamagePopups] = useState<DamagePopupState[]>([])
  const [judgeFeedback, setJudgeFeedback] = useState<JudgeResult['verdict'] | null>(null)
  const [lastRunInfo, setLastRunInfo] = useState<JudgeRunInfo | null>(null)
  const [actionEffect, setActionEffect] = useState<ActionEffect | null>(null)
  const [isShaking, setIsShaking] = useState(false)

  const hudPanelRef = useRef<HTMLElement | null>(null)
  const playerHpTextRef = useRef<HTMLSpanElement | null>(null)
  const enemyHpTextRef = useRef<HTMLSpanElement | null>(null)

  const nextQuestionTimeoutRef = useRef<number | null>(null)
  const popupIdRef = useRef(0)
  const popupTimeoutsRef = useRef<number[]>([])
  const feedbackTimeoutRef = useRef<number | null>(null)
  const effectBannerTimeoutRef = useRef<number | null>(null)
  const shakeTimeoutRef = useRef<number | null>(null)
  const shakeRafRef = useRef<number | null>(null)
  const questionTimerStartedRef = useRef(false)
  const questionTimeoutHandledRef = useRef(false)
  const previousTurnPhaseRef = useRef(turnPhase)
  const prevPlayerHpRef = useRef(playerHp)
  const prevEnemyHpRef = useRef(enemyHp)

  const getPopupPosition = useCallback((target: 'player' | 'enemy') => {
    const container = hudPanelRef.current
    const anchor = target === 'player' ? playerHpTextRef.current : enemyHpTextRef.current

    if (!container) {
      return target === 'player' ? { x: 160, y: 100 } : { x: 320, y: 100 }
    }

    if (!anchor) {
      return target === 'player'
        ? { x: container.clientWidth * 0.28, y: 100 }
        : { x: container.clientWidth * 0.72, y: 100 }
    }

    const containerRect = container.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()

    return {
      x: anchorRect.left - containerRect.left + anchorRect.width / 2,
      y: anchorRect.top - containerRect.top,
    }
  }, [])

  const addDamagePopup = useCallback(
    (value: number, color: DamagePopupState['color'], target: 'player' | 'enemy') => {
      if (value <= 0) {
        return
      }

      const id = popupIdRef.current++
      const position = getPopupPosition(target)

      setDamagePopups((prev) => [...prev, { id, value, color, x: position.x, y: position.y }])

      const timeoutId = window.setTimeout(() => {
        setDamagePopups((prev) => prev.filter((popup) => popup.id !== id))
        popupTimeoutsRef.current = popupTimeoutsRef.current.filter(
          (storedId) => storedId !== timeoutId,
        )
      }, POPUP_DURATION_MS)

      popupTimeoutsRef.current.push(timeoutId)
    },
    [getPopupPosition],
  )

  const showJudgeFeedback = useCallback((verdict: JudgeResult['verdict']) => {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current)
    }

    setJudgeFeedback(verdict)
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setJudgeFeedback(null)
      feedbackTimeoutRef.current = null
    }, FEEDBACK_DURATION_MS)
  }, [])

  const showActionEffect = useCallback((effect: ActionEffect) => {
    if (effectBannerTimeoutRef.current !== null) {
      clearTimeout(effectBannerTimeoutRef.current)
    }

    setActionEffect(effect)
    effectBannerTimeoutRef.current = window.setTimeout(() => {
      setActionEffect(null)
      effectBannerTimeoutRef.current = null
    }, EFFECT_BANNER_DURATION_MS)
  }, [])

  const triggerShake = useCallback(() => {
    if (shakeRafRef.current !== null) {
      cancelAnimationFrame(shakeRafRef.current)
      shakeRafRef.current = null
    }

    if (shakeTimeoutRef.current !== null) {
      clearTimeout(shakeTimeoutRef.current)
      shakeTimeoutRef.current = null
    }

    setIsShaking(false)

    shakeRafRef.current = window.requestAnimationFrame(() => {
      setIsShaking(true)
      shakeRafRef.current = null
    })

    shakeTimeoutRef.current = window.setTimeout(() => {
      setIsShaking(false)
      shakeTimeoutRef.current = null
    }, SHAKE_DURATION_MS)
  }, [])

  useEffect(() => {
    if (turnPhase === 'idle') {
      startStage()
      pickQuestion(floor)
      setCode('')
    }
  }, [floor, pickQuestion, startStage, turnPhase])

  useEffect(() => {
    return () => {
      if (nextQuestionTimeoutRef.current !== null) {
        clearTimeout(nextQuestionTimeoutRef.current)
      }

      popupTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId)
      })
      popupTimeoutsRef.current = []

      if (feedbackTimeoutRef.current !== null) {
        clearTimeout(feedbackTimeoutRef.current)
      }

      if (effectBannerTimeoutRef.current !== null) {
        clearTimeout(effectBannerTimeoutRef.current)
      }

      if (shakeTimeoutRef.current !== null) {
        clearTimeout(shakeTimeoutRef.current)
      }

      if (shakeRafRef.current !== null) {
        cancelAnimationFrame(shakeRafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    questionTimerStartedRef.current = false
    setTimeRemainingMs(currentQuestion ? currentQuestion.timeLimit * 1000 : 0)
  }, [currentQuestion])

  useEffect(() => {
    if (!currentQuestion || turnPhase !== 'questioning') {
      questionTimerStartedRef.current = false
      return
    }

    const totalMs = currentQuestion.timeLimit * 1000
    const startedAt = Date.now()

    const tick = () => {
      const elapsedMs = Date.now() - startedAt
      const remainingMs = Math.max(0, totalMs - elapsedMs)
      setTimeRemainingMs(remainingMs)
      questionTimerStartedRef.current = true
    }

    const kickoff = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, 200)

    return () => {
      clearTimeout(kickoff)
      clearInterval(interval)
      questionTimerStartedRef.current = false
    }
  }, [currentQuestion, turnPhase])

  useEffect(() => {
    const previousPlayerHp = prevPlayerHpRef.current

    if (turnPhase === 'idle') {
      prevPlayerHpRef.current = playerHp
      return
    }

    if (playerHp < previousPlayerHp) {
      addDamagePopup(previousPlayerHp - playerHp, 'red', 'player')
    } else if (playerHp > previousPlayerHp) {
      addDamagePopup(playerHp - previousPlayerHp, 'green', 'player')
    }

    prevPlayerHpRef.current = playerHp
  }, [addDamagePopup, playerHp, turnPhase])

  useEffect(() => {
    const previousEnemyHp = prevEnemyHpRef.current

    if (turnPhase === 'idle') {
      prevEnemyHpRef.current = enemyHp
      return
    }

    if (enemyHp < previousEnemyHp) {
      addDamagePopup(previousEnemyHp - enemyHp, 'yellow', 'enemy')
    }

    prevEnemyHpRef.current = enemyHp
  }, [addDamagePopup, enemyHp, turnPhase])

  useEffect(() => {
    const previousTurnPhase = previousTurnPhaseRef.current
    if (turnPhase === 'questioning' && previousTurnPhase !== 'questioning') {
      questionTimeoutHandledRef.current = false
      setEditorFocusTrigger((previous) => previous + 1)
    }

    previousTurnPhaseRef.current = turnPhase
  }, [turnPhase])

  const isEditorDisabled = isJudging || turnPhase !== 'questioning' || !currentQuestion

  const scheduleNextQuestion = useCallback(
    (enemyWillBeDefeated: boolean) => {
      if (nextQuestionTimeoutRef.current !== null) {
        clearTimeout(nextQuestionTimeoutRef.current)
      }

      nextQuestionTimeoutRef.current = window.setTimeout(() => {
        const latestState = useGameStore.getState()
        if (latestState.turnPhase === 'gameover') {
          nextQuestionTimeoutRef.current = null
          return
        }

        if (enemyWillBeDefeated) {
          const nextFloor = latestState.floor + 1
          advanceFloor()
          pickQuestion(nextFloor)
        } else {
          pickQuestion(latestState.floor)
        }

        setTurnPhase('questioning')
        setCode('')
        nextQuestionTimeoutRef.current = null
      }, FEEDBACK_DURATION_MS)
    },
    [advanceFloor, pickQuestion, setTurnPhase],
  )

  const resolveJudgeResult = useCallback(
    (result: JudgeResult) => {
      const enemyWillBeDefeated =
        result.effect.type === 'damageEnemy' && enemyHp - result.effect.amount <= 0

      setLastRunInfo(result.runInfo)

      if (result.effect.type === 'damageEnemy') {
        damageEnemy(result.effect.amount)
        showActionEffect('attack')
      }

      if (result.effect.type === 'healPlayer') {
        healPlayer(result.effect.amount)
        showActionEffect('heal')
      }

      if (result.effect.type === 'damagePlayer') {
        damagePlayer(result.effect.amount)
      }

      showJudgeFeedback(result.verdict)

      if (result.verdict !== 'correct') {
        triggerShake()
      }

      setTurnPhase('result')
      scheduleNextQuestion(enemyWillBeDefeated)
    },
    [
      damageEnemy,
      damagePlayer,
      enemyHp,
      healPlayer,
      scheduleNextQuestion,
      setTurnPhase,
      showActionEffect,
      showJudgeFeedback,
      triggerShake,
    ],
  )

  const handleSubmit = useCallback(async () => {
    if (isEditorDisabled || !currentQuestion) {
      return
    }

    questionTimeoutHandledRef.current = true
    setTurnPhase('judging')

    const result = await submit(code)
    resolveJudgeResult(result)
  }, [code, currentQuestion, isEditorDisabled, resolveJudgeResult, setTurnPhase, submit])

  useEffect(() => {
    if (!currentQuestion || turnPhase !== 'questioning' || isJudging) {
      return
    }

    if (!questionTimerStartedRef.current) {
      return
    }

    if (timeRemainingMs > 0 || questionTimeoutHandledRef.current) {
      return
    }

    questionTimeoutHandledRef.current = true
    setTurnPhase('judging')
    resolveJudgeResult(judgeTimeout())
  }, [
    currentQuestion,
    isJudging,
    judgeTimeout,
    resolveJudgeResult,
    setTurnPhase,
    timeRemainingMs,
    turnPhase,
  ])

  useEffect(() => {
    const onGlobalSubmitHotkey = (event: KeyboardEvent) => {
      if (event.isComposing) {
        return
      }

      const isModPressed = event.metaKey || event.ctrlKey
      const isEnterPressed =
        event.key === 'Enter' || event.code === 'Enter' || event.code === 'NumpadEnter'

      if (!isModPressed || !isEnterPressed) {
        return
      }

      event.preventDefault()
      void handleSubmit()
    }

    window.addEventListener('keydown', onGlobalSubmitHotkey, { capture: true })

    return () => {
      window.removeEventListener('keydown', onGlobalSubmitHotkey, { capture: true })
    }
  }, [handleSubmit])

  return (
    <main
      className={css({
        minH: '100vh',
        h: 'auto',
        overflow: 'visible',
        bg: '#EAEAEA',
        color: '#111111',
        px: { base: '3', md: '5' },
        py: { base: '4', md: '4' },
      })}
    >
      <div
        className={css({
          width: 'full',
          h: 'auto',
          maxW: '1220px',
          mx: 'auto',
          display: 'grid',
          gridTemplateRows: 'auto auto auto',
          gap: { base: '4', md: '5' },
          position: 'relative',
          animationName: isShaking ? 'shake' : 'none',
          animationDuration: '0.5s',
          animationTimingFunction: 'ease-in-out',
        })}
      >
        <JudgeFeedback verdict={judgeFeedback} />

        {actionEffect ? (
          <div
            className={css({
              position: 'absolute',
              top: { base: '14', md: '12' },
              left: '50%',
              transform: 'translateX(-50%)',
              px: '4',
              py: '2',
              borderRadius: 'full',
              borderWidth: '2px',
              borderColor: actionEffect === 'attack' ? '#EC41B8' : '#08C978',
              bg: actionEffect === 'attack' ? '#FDE8F6' : '#E8FDF2',
              color: actionEffect === 'attack' ? '#A71D78' : '#0A8D56',
              fontFamily: 'title',
              fontWeight: 'black',
              fontSize: { base: 'md', md: 'lg' },
              lineHeight: 'tight',
              animationName: 'fadeInOut',
              animationDuration: '0.9s',
              animationTimingFunction: 'ease-out',
              pointerEvents: 'none',
              zIndex: '21',
              whiteSpace: 'nowrap',
            })}
          >
            {actionEffect === 'attack' ? '⚔ 공격 성공!' : '✦ 체력 회복!'}
          </div>
        ) : null}

        <section
          ref={hudPanelRef}
          className={css({
            position: 'relative',
          })}
        >
          <BattleHUD
            floor={floor}
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
            enemyHp={enemyHp}
            enemyMaxHp={enemyMaxHp}
            enemyName={enemyName}
            nextAttackIn={nextAttackIn}
            nextAttackRemainingMs={nextAttackRemainingMs}
            nextAttackTotalMs={nextAttackTotalMs}
            playerEffect={actionEffect === 'heal' ? 'heal' : null}
            enemyEffect={actionEffect === 'attack' ? 'attack' : null}
            playerHpTextRef={playerHpTextRef}
            enemyHpTextRef={enemyHpTextRef}
          />
          <DamagePopup popups={damagePopups} />
        </section>

        <section>
          {currentQuestion ? (
            <QuestionPanel
              question={currentQuestion}
              timeRemainingMs={timeRemainingMs}
              totalTimeMs={currentQuestion.timeLimit * 1000}
            />
          ) : (
            <p
              className={css({
                m: '0',
                p: '4',
                borderWidth: '3px',
                borderColor: '#349CE5',
                borderRadius: 'sm',
                bg: '#ECECEC',
                fontSize: 'lg',
                color: '#333333',
              })}
            >
              문제를 준비 중입니다...
            </p>
          )}
        </section>

        <section
          className={css({
            minH: { lg: '0' },
            display: 'grid',
            gap: '2',
            gridTemplateRows: { base: 'auto auto auto auto', lg: 'auto minmax(180px, 1fr) auto auto' },
          })}
        >
          <p className={sectionTitleClassName}>달빛 에디터</p>

          <YaksokEditor
            value={code}
            onChange={setCode}
            onSubmit={() => {
              void handleSubmit()
            }}
            disabled={isEditorDisabled}
            placeholder='달빛약속 코드를 입력하세요.'
            focusTrigger={editorFocusTrigger}
          />

          <section
            className={css({
              bg: '#EFEFFF',
              borderWidth: '2px',
              borderColor: '#B7B5EC',
              borderRadius: 'sm',
              px: '3',
              py: '2',
              minH: '80px',
              maxH: { base: '160px', lg: '120px' },
              overflowY: 'auto',
              display: 'grid',
              gap: '1',
            })}
            aria-live='polite'
          >
            <p
              className={css({
                m: '0',
                fontFamily: 'title',
                fontWeight: 'bold',
                fontSize: 'md',
                color: '#4A47BA',
              })}
            >
              실행 결과
            </p>

            {lastRunInfo ? (
              <>
                <p className={css({ m: '0', fontSize: 'sm', color: '#1D1D1D' })}>{lastRunInfo.note}</p>
                {lastRunInfo.outputLines.length > 0 ? (
                  <p className={css({ m: '0', fontSize: 'sm', color: '#1D1D1D' })}>
                    출력: {lastRunInfo.outputLines.join(' | ')}
                  </p>
                ) : null}
                {lastRunInfo.expectedLines.length > 0 ? (
                  <p className={css({ m: '0', fontSize: 'sm', color: '#4B4B4B' })}>
                    정답: {lastRunInfo.expectedLines.join(' | ')}
                  </p>
                ) : null}
                {lastRunInfo.errorMessage ? (
                  <p className={css({ m: '0', fontSize: 'sm', color: '#B42323' })}>
                    오류: {lastRunInfo.errorMessage}
                  </p>
                ) : null}
              </>
            ) : (
              <p className={css({ m: '0', fontSize: 'sm', color: '#595959' })}>
                아직 실행한 결과가 없습니다.
              </p>
            )}
          </section>

          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2',
              flexWrap: 'wrap',
            })}
          >
            <p
              className={css({
                m: '0',
                fontSize: 'sm',
                color: '#595959',
                fontWeight: 'medium',
              })}
            >
              ⌘/Ctrl + Enter 로 어디서든 실행
            </p>

            <button
              type='button'
              onClick={() => {
                void handleSubmit()
              }}
              disabled={isEditorDisabled}
              className={css({
                justifySelf: 'end',
                minW: { base: '140px', md: '180px' },
                px: '5',
                py: '2',
                borderRadius: 'sm',
                borderWidth: '0',
                bg: '#6A67EB',
                color: '#FFFFFF',
                fontFamily: 'title',
                fontWeight: 'black',
                fontSize: { base: 'lg', md: 'xl' },
                lineHeight: 'tight',
                cursor: 'pointer',
                transitionDuration: 'fast',
                _hover: {
                  bg: '#5A57D9',
                },
                _disabled: {
                  cursor: 'not-allowed',
                  bg: '#B7B5EC',
                  color: '#F5F5FF',
                },
              })}
            >
              {isJudging ? '판정 중...' : '실행하기'}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
