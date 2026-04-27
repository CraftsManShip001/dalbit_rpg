import { css } from '../../../styled-system/css'

type FeedbackVerdict = 'correct' | 'wrong' | 'timeout'

interface JudgeFeedbackProps {
  verdict: FeedbackVerdict | null
}

const feedbackMeta = {
  correct: {
    text: '✓ 정답!',
    bg: 'verdict.correct',
  },
  wrong: {
    text: '✗ 오답',
    bg: 'verdict.wrong',
  },
  timeout: {
    text: '⏱ 시간 초과',
    bg: 'verdict.timeout',
  },
} as const

export default function JudgeFeedback({ verdict }: JudgeFeedbackProps) {
  if (!verdict) {
    return null
  }

  const meta = feedbackMeta[verdict]

  return (
    <div
      className={css({
        position: 'absolute',
        top: '4',
        left: '50%',
        transform: 'translateX(-50%)',
        px: '4',
        py: '2',
        borderRadius: 'full',
        borderWidth: '1px',
        borderColor: 'border.strong',
        bg: meta.bg,
        color: 'text.inverse',
        fontWeight: 'bold',
        fontSize: 'md',
        lineHeight: 'tight',
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
        animationName: 'fadeInOut',
        animationDuration: '1.5s',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'forwards',
        zIndex: '20',
        pointerEvents: 'none',
      })}
      role='status'
      aria-live='polite'
    >
      {meta.text}
    </div>
  )
}
