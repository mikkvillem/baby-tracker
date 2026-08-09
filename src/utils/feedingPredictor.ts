import type { Session } from '../app'

export type FeedingPrediction = {
  suggestedTime: Date | null
  reasoning: string
}

const DEFAULT_INTERVAL_MINUTES = 180 // 3 hours
const DEFAULT_SIGNIFICANT_INTERVAL_MINUTES = 10

function getLastFeedingReferenceTime(sessions: Session[], significantIntervalMinutes: number): Date | null {
  if (sessions.length === 0) return null

  const lastSession = sessions[0]

  // Check for intervals of at least the significant threshold
  const significantIntervals = lastSession.intervals.filter(interval => {
    if (!interval.endTime) return false
    const duration = interval.endTime.getTime() - interval.startTime.getTime()
    return duration >= significantIntervalMinutes * 60000
  })

  // If we have significant intervals, use the end time of the most recent one
  if (significantIntervals.length > 0) {
    const lastSignificantInterval = significantIntervals[significantIntervals.length - 1]
    return lastSignificantInterval.endTime!
  }

  // Otherwise, use the session start time
  return lastSession.startTime
}

export function suggestNextFeeding(
  sessions: Session[],
  intervalMinutes: number = DEFAULT_INTERVAL_MINUTES,
  significantIntervalMinutes: number = DEFAULT_SIGNIFICANT_INTERVAL_MINUTES
): FeedingPrediction {
  if (sessions.length === 0) {
    return {
      suggestedTime: new Date(Date.now() + intervalMinutes * 60000),
      reasoning: `Every ${intervalMinutes / 60} hours`
    }
  }

  const referenceTime = getLastFeedingReferenceTime(sessions, significantIntervalMinutes)
  if (!referenceTime) {
    return {
      suggestedTime: new Date(Date.now() + intervalMinutes * 60000),
      reasoning: `Every ${intervalMinutes / 60} hours`
    }
  }
  
  return {
    suggestedTime: new Date(referenceTime.getTime() + intervalMinutes * 60000),
    reasoning: `Every ${intervalMinutes / 60} hours`
  }
}

export function formatTimeUntil(date: Date): string {
  const now = Date.now()
  const diff = date.getTime() - now
  
  if (diff < 0) {
    const absDiff = Math.abs(diff)
    const minutes = Math.floor(absDiff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m overdue`
    }
    return `${minutes}m overdue`
  }
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `in ${hours}h ${minutes % 60}m`
  }
  return `in ${minutes}m`
}

