import { css } from '../../../styled-system/css'

export type DamagePopup = {
  id: number
  value: number
  color: 'red' | 'yellow' | 'green'
  x: number
  y: number
}

interface DamagePopupProps {
  popups: DamagePopup[]
}

const popupColorMap = {
  red: 'damage.player',
  yellow: 'damage.enemy',
  green: 'damage.heal',
} as const

export default function DamagePopup({ popups }: DamagePopupProps) {
  if (popups.length === 0) {
    return null
  }

  return (
    <div
      className={css({
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        zIndex: '10',
      })}
      aria-hidden='true'
    >
      {popups.map((popup) => (
        <span
          key={popup.id}
          className={css({
            position: 'absolute',
            left: `${popup.x}px`,
            top: `${popup.y}px`,
            transform: 'translate(-50%, -100%)',
            fontFamily: 'mono',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: popupColorMap[popup.color],
            textShadow: '0 0 8px rgba(0, 0, 0, 0.55)',
            animationName: 'floatUp',
            animationDuration: '0.8s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
          })}
        >
          {popup.color === 'green' ? '+' : '-'}
          {popup.value}
        </span>
      ))}
    </div>
  )
}
