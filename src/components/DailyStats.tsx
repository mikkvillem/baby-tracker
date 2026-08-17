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

  return (
    <div class="grid grid-cols-4 gap-2">
      <div class="bg-white dark:bg-surface-800 rounded-xl p-3 text-center border border-surface-200 dark:border-surface-700">
        <div class="text-2xl font-bold text-surface-800 dark:text-surface-100">{totalSessions}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.sessions}</div>
      </div>
      <div class="bg-side-left-50 dark:bg-side-left-500/10 rounded-xl p-3 text-center border border-side-left-100 dark:border-side-left-500/20">
        <div class="text-2xl font-bold text-side-left-600 dark:text-side-left-500">{formatDurationShort(leftTime)}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.left}</div>
      </div>
      <div class="bg-side-right-50 dark:bg-side-right-500/10 rounded-xl p-3 text-center border border-side-right-100 dark:border-side-right-500/20">
        <div class="text-2xl font-bold text-side-right-600 dark:text-side-right-500">{formatDurationShort(rightTime)}</div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.right}</div>
      </div>
      <div class={`rounded-xl p-3 text-center border ${
        lastSide === 'left'
          ? 'bg-side-left-50 dark:bg-side-left-500/10 border-side-left-100 dark:border-side-left-500/20'
          : lastSide === 'right'
            ? 'bg-side-right-50 dark:bg-side-right-500/10 border-side-right-100 dark:border-side-right-500/20'
            : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700'
      }`}>
        <div class={`text-2xl font-bold ${
          lastSide === 'left' ? 'text-side-left-600 dark:text-side-left-500'
            : lastSide === 'right' ? 'text-side-right-600 dark:text-side-right-500'
              : 'text-surface-400'
        }`}>
          {lastSide ? lastSide[0].toUpperCase() : '-'}
        </div>
        <div class="text-[11px] font-medium text-surface-500 mt-0.5">{t.last}</div>
      </div>
    </div>
  )
}
