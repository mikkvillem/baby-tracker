import type { Session } from '../app'
import { getTotalTimeForSideMs, formatDurationShort, getLastOfferedSide } from '../utils/sessionFormatters'
import { translations } from '../i18n'

type Props = {
  sessions: Session[]
}

export function DailyStats({ sessions }: Props) {
  const t = translations.value.dailyStats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime)
    sessionDate.setHours(0, 0, 0, 0)
    return sessionDate.getTime() === today.getTime()
  })

  const totalSessions = todaySessions.length
  const leftTime = getTotalTimeForSideMs(todaySessions, 'left')
  const rightTime = getTotalTimeForSideMs(todaySessions, 'right')
  const lastSide = getLastOfferedSide(sessions)

  const sideColor = (side: 'left' | 'right') =>
    side === 'left'
      ? 'text-side-left-600 dark:text-side-left-500'
      : 'text-side-right-600 dark:text-side-right-500'

  return (
    <div class="grid grid-cols-4 gap-2 text-center">
      <div>
        <div class="text-2xl font-semibold text-surface-700 dark:text-surface-100">{totalSessions}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.sessions}</div>
      </div>
      <div>
        <div class={`text-2xl font-semibold ${sideColor('left')}`}>{formatDurationShort(leftTime)}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.left}</div>
      </div>
      <div>
        <div class={`text-2xl font-semibold ${sideColor('right')}`}>{formatDurationShort(rightTime)}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.right}</div>
      </div>
      <div>
        <div class={`text-2xl font-semibold ${lastSide ? sideColor(lastSide) : 'text-surface-400'}`}>
          {lastSide ? lastSide[0].toUpperCase() : '-'}
        </div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.last}</div>
      </div>
    </div>
  )
}
