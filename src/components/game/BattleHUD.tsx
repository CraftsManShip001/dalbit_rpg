import type { Ref } from 'react'
import { css } from '../../../styled-system/css'
import HealthBar from '../ui/HealthBar'

interface BattleHUDProps {
  floor: number
  playerHp: number
  playerMaxHp: number
  enemyHp: number
  enemyMaxHp: number
  enemyName: string
  nextAttackIn: number
  nextAttackRemainingMs: number
  nextAttackTotalMs: number
  playerEffect?: 'heal' | null
  enemyEffect?: 'attack' | null
  playerHpTextRef?: Ref<HTMLSpanElement>
  enemyHpTextRef?: Ref<HTMLSpanElement>
}

const labelClassName = css({
  fontFamily: 'title',
  fontWeight: 'black',
  fontSize: { base: '3xl', md: '4xl' },
  lineHeight: 'tight',
  transform: 'skewX(-10deg)',
  letterSpacing: '-0.02em',
})

function toAttackClock(seconds: number): string {
  const safeSeconds = Math.max(0, seconds)
  const minute = Math.floor(safeSeconds / 60)
  const second = safeSeconds % 60

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

export default function BattleHUD({
  floor,
  playerHp,
  playerMaxHp,
  enemyHp,
  enemyMaxHp,
  enemyName,
  nextAttackIn,
  nextAttackRemainingMs,
  nextAttackTotalMs,
  playerEffect = null,
  enemyEffect = null,
  playerHpTextRef,
  enemyHpTextRef,
}: BattleHUDProps) {
  const isAttackDanger = nextAttackIn <= 3
  const attackGaugeClassName = isAttackDanger
    ? css({
        w: 'full',
        h: '3',
        display: 'block',
        appearance: 'none',
        WebkitAppearance: 'none',
        border: 'none',
        borderRadius: 'full',
        overflow: 'hidden',
        '&::-webkit-progress-bar': {
          background: '#F8D2DD',
        },
        '&::-webkit-progress-value': {
          transition: 'width 0.1s linear',
          background: 'linear-gradient(90deg, #E03131 0%, #FF6B6B 100%)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.22)',
        },
        '&::-moz-progress-bar': {
          transition: 'width 0.1s linear',
          background: 'linear-gradient(90deg, #E03131 0%, #FF6B6B 100%)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.22)',
        },
      })
    : css({
        w: 'full',
        h: '3',
        display: 'block',
        appearance: 'none',
        WebkitAppearance: 'none',
        border: 'none',
        borderRadius: 'full',
        overflow: 'hidden',
        '&::-webkit-progress-bar': {
          background: '#F3D8EA',
        },
        '&::-webkit-progress-value': {
          transition: 'width 0.1s linear',
          background: 'linear-gradient(90deg, #EC41B8 0%, #F06BC8 100%)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.22)',
        },
        '&::-moz-progress-bar': {
          transition: 'width 0.1s linear',
          background: 'linear-gradient(90deg, #EC41B8 0%, #F06BC8 100%)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.22)',
        },
      })

  return (
    <section
      className={css({
        display: 'grid',
        gap: { base: '4', md: '3' },
        gridTemplateColumns: { base: '1fr', md: '220px 1fr 1fr' },
        alignItems: 'end',
      })}
      aria-label='전투 HUD'
    >
      <div
        className={css({
          display: 'grid',
          alignContent: 'start',
          gap: '1',
        })}
      >
        <p
          className={css({
            m: '0',
            fontFamily: 'title',
            fontWeight: 'black',
            fontSize: { base: '56px', md: '74px' },
            lineHeight: 'tight',
            letterSpacing: '-0.04em',
            color: '#0B0B0B',
            transform: 'skewX(-8deg)',
          })}
        >
          {floor}층
        </p>
      </div>

      <div
        className={css({
          display: 'grid',
          gap: '2',
          position: 'relative',
          transitionDuration: 'fast',
          transform: playerEffect === 'heal' ? 'scale(1.015)' : 'scale(1)',
          boxShadow:
            playerEffect === 'heal' ? '0 0 0 4px rgba(8, 201, 120, 0.22)' : 'none',
          borderRadius: 'sm',
        })}
      >
        <p className={`${labelClassName} ${css({ color: '#08C978', m: '0' })}`}>체력</p>
        <span
          ref={playerHpTextRef}
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            w: '1px',
            h: '1px',
            opacity: '0',
            pointerEvents: 'none',
          })}
        />
        <HealthBar current={playerHp} max={playerMaxHp} color='player' />
      </div>

      <div
        className={css({
          display: 'grid',
          gap: '2',
          position: 'relative',
          transitionDuration: 'fast',
          transform: enemyEffect === 'attack' ? 'scale(1.015)' : 'scale(1)',
          boxShadow:
            enemyEffect === 'attack' ? '0 0 0 4px rgba(236, 65, 184, 0.22)' : 'none',
          borderRadius: 'sm',
        })}
      >
        <p className={`${labelClassName} ${css({ color: '#EC41B8', m: '0' })}`}>{enemyName}</p>
        <span
          ref={enemyHpTextRef}
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            w: '1px',
            h: '1px',
            opacity: '0',
            pointerEvents: 'none',
          })}
        />
        <HealthBar current={enemyHp} max={enemyMaxHp} color='enemy' />
      </div>

      <div
        className={css({
          gridColumn: { base: '1 / -1', md: '3 / 4' },
          justifySelf: { base: 'stretch', md: 'end' },
          width: { base: 'full', md: 'min(100%, 460px)' },
          display: 'grid',
          gap: '1',
          mt: { base: '0', md: '1' },
          p: '2',
          borderRadius: 'sm',
          bg: '#F9EDF4',
          borderWidth: '1px',
          borderColor: isAttackDanger ? '#E03131' : '#EC41B8',
          boxShadow: isAttackDanger
            ? '0 0 0 2px rgba(224, 49, 49, 0.12)'
            : '0 0 0 2px rgba(236, 65, 184, 0.12)',
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '2',
          })}
        >
          <p
            className={css({
              m: '0',
              fontFamily: 'title',
              fontWeight: 'black',
              fontSize: { base: 'md', md: 'lg' },
              color: isAttackDanger ? '#E03131' : '#C92F9A',
              transform: 'skewX(-8deg)',
            })}
          >
            적 공격
          </p>
          <p
            className={css({
              m: '0',
              fontFamily: 'mono',
              fontWeight: 'bold',
              fontSize: { base: 'md', md: 'lg' },
              color: isAttackDanger ? '#B42323' : '#5A3250',
            })}
          >
            {toAttackClock(nextAttackIn)}
          </p>
        </div>
        <progress
          className={attackGaugeClassName}
          value={Math.max(0, nextAttackRemainingMs)}
          max={Math.max(1, nextAttackTotalMs)}
          aria-label='적 공격 남은 시간'
          aria-valuemin={0}
          aria-valuemax={Math.max(1, nextAttackTotalMs)}
          aria-valuenow={Math.max(0, nextAttackRemainingMs)}
        />
      </div>
    </section>
  )
}
