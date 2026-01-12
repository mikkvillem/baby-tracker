import type { Session } from '../app'
import type { FeedingSettings } from '../store/settings'

export type FeedingPrediction = {
  suggestedTime: Date | null
  confidence: 'low' | 'medium' | 'high'
  reasoning: string
}

function getLastFeedingReferenceTime(sessions: Session[]): Date | null {
  if (sessions.length === 0) return null
  
  const lastSession = sessions[0]
  
  // Check for intervals of at least 10 minutes
  const significantIntervals = lastSession.intervals.filter(interval => {
    if (!interval.endTime) return false
    const duration = interval.endTime.getTime() - interval.startTime.getTime()
    return duration >= 10 * 60000 // 10 minutes in milliseconds
  })
  
  // If we have significant intervals, use the end time of the most recent one
  if (significantIntervals.length > 0) {
    const lastSignificantInterval = significantIntervals[significantIntervals.length - 1]
    return lastSignificantInterval.endTime!
  }
  
  // Otherwise, use the session start time
  return lastSession.startTime
}

function calculateSimpleInterval(
  sessions: Session[],
  settings: FeedingSettings
): Date | null {
  const referenceTime = getLastFeedingReferenceTime(sessions)
  if (!referenceTime) return null
  
  const intervalMinutes = settings.simpleIntervalMinutes
  
  return new Date(referenceTime.getTime() + intervalMinutes * 60000)
}

function calculateDistribution(
  sessions: Session[],
  settings: FeedingSettings
): Date | null {
  const targetSessions = settings.targetDailySessions
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySessions = sessions.filter(s => s.startTime >= today)
  
  const sessionsHadToday = todaySessions.length
  const sessionsRemaining = Math.max(0, targetSessions - sessionsHadToday)
  
  if (sessionsRemaining === 0) {
    return calculateSimpleInterval(sessions, settings)
  }
  
  const now = new Date()
  const wakingStart = new Date(today)
  wakingStart.setHours(settings.wakingStartHour, 0, 0, 0)
  const wakingEnd = new Date(today)
  wakingEnd.setHours(settings.wakingEndHour, 0, 0, 0)
  
  const remainingMinutes = Math.max(0, 
    (wakingEnd.getTime() - now.getTime()) / 60000
  )
  
  if (remainingMinutes === 0) {
    const tomorrow = new Date(wakingStart)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }
  
  const intervalMinutes = remainingMinutes / (sessionsRemaining + 1)
  
  const referenceTime = getLastFeedingReferenceTime(sessions)
  if (!referenceTime) {
    return new Date(now.getTime() + intervalMinutes * 60000)
  }
  
  return new Date(
    Math.max(
      referenceTime.getTime() + intervalMinutes * 60000,
      now.getTime() + 30 * 60000
    )
  )
}

function calculateAdaptive(
  sessions: Session[],
  settings: FeedingSettings
): Date | null {
  if (sessions.length < 5) {
    return calculateSimpleInterval(sessions, settings)
  }
  
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentSessions = sessions.filter(s => s.startTime >= sevenDaysAgo)
  
  const intervals: number[] = []
  for (let i = 0; i < recentSessions.length - 1; i++) {
    const interval = recentSessions[i].startTime.getTime() - 
                    recentSessions[i + 1].startTime.getTime()
    intervals.push(interval / 60000)
  }
  
  let weightedSum = 0
  let weightSum = 0
  intervals.forEach((interval, index) => {
    const weight = Math.exp(-index * 0.1)
    weightedSum += interval * weight
    weightSum += weight
  })
  
  const avgInterval = weightedSum / weightSum
  
  const now = new Date()
  const hourOfDay = now.getHours()
  
  let adjustedInterval = avgInterval
  if (hourOfDay >= settings.wakingEndHour || hourOfDay < settings.wakingStartHour) {
    adjustedInterval *= 1.5
  }
  
  const referenceTime = getLastFeedingReferenceTime(sessions)
  if (!referenceTime) return null
  
  const lastSession = sessions[0]
  const totalDuration = lastSession.intervals.reduce((sum, interval) => {
    if (!interval.endTime) return sum
    return sum + (interval.endTime.getTime() - interval.startTime.getTime())
  }, 0) / 60000
  
  if (totalDuration > 20) {
    adjustedInterval *= 1.2
  } else if (totalDuration < 10) {
    adjustedInterval *= 0.8
  }
  
  return new Date(
    referenceTime.getTime() + adjustedInterval * 60000
  )
}

export function suggestNextFeeding(
  sessions: Session[],
  settings: FeedingSettings
): FeedingPrediction {
  if (sessions.length === 0) {
    return {
      suggestedTime: new Date(Date.now() + 2.5 * 60 * 60000),
      confidence: 'low',
      reasoning: 'No history available, suggesting 2.5 hours from now'
    }
  }
  
  switch (settings.predictorMethod) {
    case 'distribution':
      return {
        suggestedTime: calculateDistribution(sessions, settings),
        confidence: 'medium',
        reasoning: `Based on ${settings.targetDailySessions} daily feeding goal`
      }
    
    case 'adaptive':
      if (sessions.length < 5) {
        return {
          suggestedTime: calculateSimpleInterval(sessions, settings),
          confidence: 'low',
          reasoning: 'Not enough data for adaptive prediction'
        }
      }
      return {
        suggestedTime: calculateAdaptive(sessions, settings),
        confidence: 'high',
        reasoning: 'Based on your recent feeding patterns'
      }
    
    case 'simple':
    default:
      return {
        suggestedTime: calculateSimpleInterval(sessions, settings),
        confidence: 'medium',
        reasoning: `Every ${settings.simpleIntervalMinutes} minutes`
      }
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

