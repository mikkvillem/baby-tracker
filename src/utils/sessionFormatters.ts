import type { Session, Interval } from '../app'
import { translations } from '../i18n'

export function getTotalTimeForSide(
  intervals: Interval[],
  side: 'left' | 'right',
  options?: { activeSide?: 'left' | 'right'; currentIntervalStart?: Date | null }
): number {
  const completedTime = intervals
    .filter(i => i.side === side && i.endTime)
    .reduce((sum, i) => sum + (i.endTime!.getTime() - i.startTime.getTime()), 0)

  const activeTime =
    options?.activeSide === side && options?.currentIntervalStart
      ? Date.now() - options.currentIntervalStart.getTime()
      : 0

  return Math.floor((completedTime + activeTime) / 1000)
}

export function getTotalTimeForSideMs(
  sessions: Session[],
  side: 'left' | 'right',
  sessionFilter?: (s: Session) => boolean
): number {
  const list = sessionFilter ? sessions.filter(sessionFilter) : sessions
  return list.reduce((total, session) => {
    const sideTime = session.intervals
      .filter(i => i.side === side && i.endTime)
      .reduce((sum, i) => sum + (i.endTime!.getTime() - i.startTime.getTime()), 0)
    return total + sideTime
  }, 0)
}

export function getLastOfferedSide(sessions: Session[]): 'left' | 'right' | null {
  if (sessions.length === 0) return null
  const sorted = [...sessions].sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  for (const session of sorted) {
    if (session.intervals.length > 0) {
      const last = session.intervals[session.intervals.length - 1]
      if (last.endTime) return last.side
    }
  }
  return null
}

export function formatDuration(intervals: Interval[]): string {
  const total = intervals.reduce((sum, interval) => {
    if (!interval.endTime) return sum
    return sum + (interval.endTime.getTime() - interval.startTime.getTime())
  }, 0)
  const minutes = Math.floor(total / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  return translations.value.duration.minutesSeconds({ m: minutes, s: seconds })
}

export function formatDurationMin(intervals: Interval[]): string {
  const total = intervals.reduce((sum, interval) => {
    if (!interval.endTime) return sum
    return sum + (interval.endTime.getTime() - interval.startTime.getTime())
  }, 0)
  const minutes = Math.floor(total / 60000)
  return translations.value.duration.minutesShort({ m: minutes })
}

export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return translations.value.duration.hoursMinutes({ h: hours, m: minutes })
  return translations.value.duration.minutesOnly({ m: minutes })
}

export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatIntervalDuration(startTime: Date, endTime: Date): string {
  const totalSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return translations.value.duration.minutesSeconds({ m: mins, s: secs })
}

export function getSideCounts(intervals: Interval[]): { left: number; right: number } {
  const left = intervals.filter(i => i.side === 'left').length
  const right = intervals.filter(i => i.side === 'right').length
  return { left, right }
}
