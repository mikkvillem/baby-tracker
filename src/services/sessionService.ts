import type { Session, Interval } from '../app'
import { getSession, putSession, deleteSessionRecord } from '../db'

export async function updateSessionIntervals(
  sessionId: string,
  intervals: Interval[]
): Promise<Session | null> {
  const session = await getSession(sessionId)
  if (!session) return null
  const updated = { ...session, intervals }
  await putSession(updated)
  return updated
}

export async function endSession(sessionId: string): Promise<void> {
  const session = await getSession(sessionId)
  if (!session) return
  await putSession({ ...session, isActive: false })
}

export async function deleteSession(sessionId: string): Promise<void> {
  await deleteSessionRecord(sessionId)
}
