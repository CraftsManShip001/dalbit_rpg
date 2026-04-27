import { useState } from 'react'
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

export default function HomePage() {
  const { bestFloor, startGame } = useGameStore()
  const [isRulesOpen, setIsRulesOpen] = useState(false)

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
            fontSize: { base: '58px', md: '96px' },
            lineHeight: 'tight',
            color: '#6A67EB',
            letterSpacing: '-0.03em',
            transform: 'skewX(-10deg)',
          })}
        >
          달빛 RPG
        </h1>

        <p
          className={css({
            m: '0',
            fontSize: { base: '3xl', md: '54px' },
            lineHeight: 'tight',
            color: '#111111',
          })}
        >
          최고기록 : {bestFloor}층
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
          시작하기
        </button>

        <button
          type='button'
          onClick={() => setIsRulesOpen((prev) => !prev)}
          className={`${actionButtonClassName} ${css({
            bg: '#D8D5E6',
            color: '#111111',
            _hover: { bg: '#CAC6DB' },
          })}`}
        >
          플레이 규칙
        </button>

        {isRulesOpen ? (
          <article
            className={css({
              width: 'full',
              maxW: '620px',
              bg: '#F3F3F3',
              borderWidth: '2px',
              borderColor: '#6A67EB',
              borderRadius: 'sm',
              p: '5',
              textAlign: 'left',
              display: 'grid',
              gap: '2',
            })}
          >
            <h2
              className={css({
                m: '0 0 8px 0',
                fontFamily: 'title',
                fontWeight: 'black',
                fontSize: '2xl',
                color: '#6A67EB',
              })}
            >
              플레이 규칙
            </h2>
            <p className={css({ m: '0', fontSize: 'lg', color: '#222222', lineHeight: 'normal' })}>
              빠른 문제: 출력값이 맞으면 몬스터에게 피해를 줍니다.
            </p>
            <p className={css({ m: '0', fontSize: 'lg', color: '#222222', lineHeight: 'normal' })}>
              따라치기: 코드가 완전히 같으면 체력을 회복합니다.
            </p>
            <p className={css({ m: '0', fontSize: 'lg', color: '#222222', lineHeight: 'normal' })}>
              알고리즘: 성공하면 큰 피해, 실패하면 내 체력이 크게 줄어듭니다.
            </p>
            <p className={css({ m: '0', fontSize: 'lg', color: '#222222', lineHeight: 'normal' })}>
              몬스터를 처치할 때마다 다음 층으로 올라가며 난이도가 계속 상승합니다.
            </p>
            <p className={css({ m: '0', fontSize: 'lg', color: '#222222', lineHeight: 'normal' })}>
              제한시간 안에 답하지 못하면 문제 유형에 따라 효과가 없거나 체력을 잃습니다.
            </p>
          </article>
        ) : null}
      </section>
    </main>
  )
}
