import { css } from '../../../styled-system/css'

interface HealthBarProps {
  current: number
  max: number
  color: 'player' | 'enemy'
}

function toPercent(current: number, max: number): number {
  if (max <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (current / max) * 100))
}

function toSafeValue(current: number, max: number): { value: number; max: number } {
  const safeMax = Math.max(1, max)
  const safeValue = Math.max(0, Math.min(current, safeMax))

  return { value: safeValue, max: safeMax }
}

const shellClassName = css({
  position: 'relative',
  w: 'full',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 5px 0 rgba(0, 0, 0, 0.08)',
})

const progressBaseClassName = css({
  w: 'full',
  h: { base: '52px', md: '64px' },
  display: 'block',
  appearance: 'none',
  WebkitAppearance: 'none',
  border: 'none',
  borderRadius: '12px',
  overflow: 'hidden',
})

const playerHighClassName = css({
  accentColor: '#08C978',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #DDF9EA 0%, #B9EFCF 100%)',
    boxShadow: 'inset 0 0 0 2px #79D8A5',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #07B96F 0%, #0CD88A 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #07B96F 0%, #0CD88A 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const playerMediumClassName = css({
  accentColor: '#12B373',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #DDF9EA 0%, #B9EFCF 100%)',
    boxShadow: 'inset 0 0 0 2px #79D8A5',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #0FA467 0%, #35D88E 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #0FA467 0%, #35D88E 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const playerLowClassName = css({
  accentColor: '#0B7E4E',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #DDF9EA 0%, #B9EFCF 100%)',
    boxShadow: 'inset 0 0 0 2px #79D8A5',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #0B7E4E 0%, #1DB977 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #0B7E4E 0%, #1DB977 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const enemyHighClassName = css({
  accentColor: '#EC41B8',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #FFE3F6 0%, #F9C9E9 100%)',
    boxShadow: 'inset 0 0 0 2px #EE9ED4',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #DE34AA 0%, #F05CC4 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #DE34AA 0%, #F05CC4 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const enemyMediumClassName = css({
  accentColor: '#D13AA4',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #FFE3F6 0%, #F9C9E9 100%)',
    boxShadow: 'inset 0 0 0 2px #EE9ED4',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #CC2F9E 0%, #EB56BC 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #CC2F9E 0%, #EB56BC 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const enemyLowClassName = css({
  accentColor: '#B72B8C',
  '&::-webkit-progress-bar': {
    background: 'linear-gradient(180deg, #FFE3F6 0%, #F9C9E9 100%)',
    boxShadow: 'inset 0 0 0 2px #EE9ED4',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #A8247F 0%, #D93FA9 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.25s ease-out',
    background: 'linear-gradient(90deg, #A8247F 0%, #D93FA9 100%)',
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.16)',
  },
})

const playerTextClassName = css({
  textShadow: '0 3px 0 rgba(10, 112, 67, 0.28)',
})

const enemyTextClassName = css({
  textShadow: '0 3px 0 rgba(147, 23, 107, 0.28)',
})

export default function HealthBar({ current, max, color }: HealthBarProps) {
  const ratioPercent = toPercent(current, max)
  const safe = toSafeValue(current, max)
  const isDanger = ratioPercent <= 25
  const level = ratioPercent <= 25 ? 'low' : ratioPercent <= 55 ? 'medium' : 'high'

  const progressToneClassName =
    color === 'player'
      ? level === 'high'
        ? playerHighClassName
        : level === 'medium'
          ? playerMediumClassName
          : playerLowClassName
      : level === 'high'
        ? enemyHighClassName
        : level === 'medium'
          ? enemyMediumClassName
          : enemyLowClassName

  const textToneClassName = color === 'player' ? playerTextClassName : enemyTextClassName

  return (
    <div
      className={shellClassName}
      role='progressbar'
      aria-valuenow={safe.value}
      aria-valuemin={0}
      aria-valuemax={safe.max}
      aria-label={color === 'player' ? '플레이어 체력' : '적 체력'}
    >
      <progress
        className={`${progressBaseClassName} ${progressToneClassName}`}
        value={safe.value}
        max={safe.max}
      />

      <div
        className={css({
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          borderRadius: '12px',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.04) 45%, rgba(255, 255, 255, 0.12) 100%)',
        })}
      />

      <div
        className={css({
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          borderRadius: '12px',
          opacity: '0.35',
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent 28px, rgba(255, 255, 255, 0.18) 28px, rgba(255, 255, 255, 0.18) 32px)',
        })}
      />

      <span
        className={`${textToneClassName} ${css({
          position: 'absolute',
          left: { base: '4', md: '5' },
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'title',
          fontWeight: 'black',
          fontSize: { base: '3xl', md: '5xl' },
          lineHeight: 'tight',
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          animationName: isDanger ? 'blink' : 'none',
          animationDuration: '0.8s',
          animationIterationCount: 'infinite',
        })}`}
      >
        {Math.round(ratioPercent)}%
      </span>

      <span
        className={css({
          position: 'absolute',
          right: { base: '3', md: '4' },
          bottom: { base: '1', md: '2' },
          fontFamily: 'mono',
          fontWeight: 'bold',
          fontSize: { base: 'xs', md: 'sm' },
          color: '#FFFFFF',
          textShadow: '0 1px 0 rgba(0, 0, 0, 0.32)',
          opacity: '0.95',
        })}
      >
        {Math.max(0, current)} / {Math.max(0, max)}
      </span>
    </div>
  )
}
