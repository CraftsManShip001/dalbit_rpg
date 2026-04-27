import { css } from '../../styled-system/css'
import { useGameStore } from '../store/gameStore'

const actionButtonClassName = css({
  width: 'full',
  maxW: '420px',
  px: '6',
  py: '4',
  borderRadius: 'sm',
  borderWidth: '0',
  fontFamily: 'title',
  fontWeight: 'black',
  fontSize: { base: '3xl', md: '4xl' },
  lineHeight: 'tight',
  cursor: 'pointer',
  transitionDuration: 'fast',
})

export default function ResultPage() {
  const { screen, floor, startGame, goHome } = useGameStore()

  if (screen !== 'result') {
    return null
  }

  return (
    <main
      className={css({
        minH: '100vh',
        bg: '#EAEAEA',
        px: '4',
        py: { base: '10', md: '16' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <section
        className={css({
          width: 'full',
          maxW: '760px',
          display: 'grid',
          gap: { base: '6', md: '8' },
          justifyItems: 'center',
          textAlign: 'center',
        })}
      >
        <h1
          className={css({
            m: '0',
            fontFamily: 'title',
            fontWeight: 'black',
            fontSize: { base: '64px', md: '108px' },
            lineHeight: 'tight',
            color: '#6A67EB',
            letterSpacing: '-0.03em',
            transform: 'skewX(-10deg)',
          })}
        >
          게임오버!
        </h1>

        <p
          className={css({
            m: '0',
            fontFamily: 'title',
            fontWeight: 'black',
            fontSize: { base: '52px', md: '82px' },
            lineHeight: 'tight',
            color: '#111111',
            transform: 'skewX(-6deg)',
          })}
        >
          {floor}층
        </p>

        <button
          type='button'
          onClick={startGame}
          className={`${actionButtonClassName} ${css({
            bg: '#6A67EB',
            color: '#FFFFFF',
            _hover: { bg: '#5A57D9' },
          })}`}
        >
          다시하기
        </button>

        <button
          type='button'
          onClick={goHome}
          className={`${actionButtonClassName} ${css({
            bg: '#D8D5E6',
            color: '#111111',
            _hover: { bg: '#CAC6DB' },
          })}`}
        >
          홈으로
        </button>
      </section>
    </main>
  )
}
