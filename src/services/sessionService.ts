import type { Session, Interval } from '../app'
import { loadSessions, saveSessions } from '../db'

export async function updateSessionIntervals(
  sessionId: string,
  intervals: Interval[]
): Promise<Session | null> {
  const sessions = await loadSessions()
  const updatedSessions = sessions.map(s =>
    s.id === sessionId ? { ...s, intervals } : s
  )
  await saveSessions(updatedSessions)
  return updatedSessions.find(s => s.id === sessionId) ?? null
}

export async function endSession(sessionId: string): Promise<void> {
  const sessions = await loadSessions()
  const updatedSessions = sessions.map(s =>
    s.id === sessionId ? { ...s, isActive: false } : s
  )
  await saveSessions(updatedSessions)
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await loadSessions()
  const updatedSessions = sessions.filter(s => s.id !== sessionId)
  await saveSessions(updatedSessions)
}
