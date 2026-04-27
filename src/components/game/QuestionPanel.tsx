import type { ClipboardEvent, DragEvent, MouseEvent } from 'react'
import type { Question } from '../../data/questions'
import { css } from '../../../styled-system/css'

interface QuestionPanelProps {
  question: Question
  timeRemainingMs: number
  totalTimeMs: number
}

function toPercent(currentMs: number, totalMs: number): number {
  if (totalMs <= 0) {
    return 0
  }

  return Math.max(0, Math.min(100, (currentMs / totalMs) * 100))
}

function toSecondsCeil(ms: number): number {
  return Math.max(0, Math.ceil(ms / 1000))
}

function toClock(ms: number): string {
  const seconds = toSecondsCeil(ms)
  const minute = Math.floor(seconds / 60)
  const second = seconds % 60

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

function toSafeProgressValue(value: number, max: number): { value: number; max: number } {
  const safeMax = Math.max(1, max)
  const safeValue = Math.max(0, Math.min(value, safeMax))

  return { value: safeValue, max: safeMax }
}

function getQuestionLabel(type: Question['type']): string {
  if (type === 'quick') {
    return '빠른'
  }

  if (type === 'copy') {
    return '따라치기'
  }

  return '알고리즘'
}

function preventClipboardAction(event: ClipboardEvent<HTMLElement>): void {
  event.preventDefault()
}

function preventDragAction(event: DragEvent<HTMLElement>): void {
  event.preventDefault()
}

function preventContextMenu(event: MouseEvent<HTMLElement>): void {
  event.preventDefault()
}

const timerGaugeClassName = css({
  w: 'full',
  h: '3',
  display: 'block',
  appearance: 'none',
  WebkitAppearance: 'none',
  border: 'none',
  borderRadius: 'full',
  overflow: 'hidden',
  '&::-webkit-progress-bar': {
    background: '#CFEAFF',
  },
  '&::-webkit-progress-value': {
    transition: 'width 0.08s linear',
    boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
    background: 'linear-gradient(90deg, #35A9F0 0%, #74D0FF 100%)',
  },
  '&::-moz-progress-bar': {
    transition: 'width 0.08s linear',
    boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
    background: 'linear-gradient(90deg, #35A9F0 0%, #74D0FF 100%)',
  },
})

export default function QuestionPanel({
  question,
  timeRemainingMs,
  totalTimeMs,
}: QuestionPanelProps) {
  const safeProgress = toSafeProgressValue(timeRemainingMs, totalTimeMs)
  const ratioPercent = toPercent(timeRemainingMs, totalTimeMs)
  const isDanger = ratioPercent <= 20

  return (
    <section
      className={css({
        display: 'grid',
        gap: '3',
      })}
      aria-label='문제 패널'
    >
      <div
        className={css({
          display: 'grid',
          gap: '1',
        })}
      >
        <h2
          className={css({
            m: '0',
            fontFamily: 'title',
            fontWeight: 'black',
            fontSize: { base: '3xl', md: '4xl' },
            lineHeight: 'tight',
            color: '#349CE5',
            transform: 'skewX(-10deg)',
            letterSpacing: '-0.02em',
          })}
        >
          문제 - {getQuestionLabel(question.type)}
        </h2>
      </div>

      <div className={css({ display: 'grid', gap: '1' })}>
        <p
          className={css({
            m: '0',
            fontFamily: 'mono',
            fontWeight: 'bold',
            fontSize: { base: 'lg', md: 'xl' },
            color: isDanger ? '#246CA3' : '#4A4A4A',
            letterSpacing: '0.08em',
          })}
        >
          {toClock(timeRemainingMs)}
        </p>

        <progress
          className={timerGaugeClassName}
          value={safeProgress.value}
          max={safeProgress.max}
          aria-valuemin={0}
          aria-valuemax={safeProgress.max}
          aria-valuenow={safeProgress.value}
          aria-label='문제 제한시간'
        />
      </div>

      <div
        className={css({
          minH: { base: '160px', md: '120px' },
          maxH: { base: '260px', md: '220px' },
          borderWidth: '3px',
          borderColor: '#349CE5',
          borderRadius: 'sm',
          bg: '#ECECEC',
          p: { base: '4', md: '5' },
          overflowY: 'auto',
          overflowX: 'hidden',
          userSelect: 'none',
        })}
        onCopy={preventClipboardAction}
        onCut={preventClipboardAction}
        onDragStart={preventDragAction}
        onContextMenu={preventContextMenu}
      >
        {question.type === 'copy' ? (
          <pre
            className={css({
              m: '0',
              fontFamily: 'mono',
              fontSize: { base: 'xs', md: 'sm' },
              lineHeight: 'normal',
              color: '#111111',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            })}
          >
            {question.codeToType}
          </pre>
        ) : (
          <p
            className={css({
              m: '0',
              fontSize: { base: 'lg', md: 'xl' },
              lineHeight: 'normal',
              color: '#111111',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            })}
          >
            {question.prompt}
          </p>
        )}
      </div>
    </section>
  )
}
