import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { SessionList } from '../components/SessionList'
import { loadSessions, saveSessions, initDB } from '../db'
import type { Session } from '../app'

export const Route = createFileRoute('/')({
  component: SessionListRoute
})

function SessionListRoute() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initDB().then(() => {
      loadSessions().then(loadedSessions => {
        const sortedSessions = loadedSessions.sort((a, b) =>
          b.startTime.getTime() - a.startTime.getTime()
        )
        setSessions(sortedSessions)
        setDbReady(true)
      })
    })
  }, [])

  useEffect(() => {
    if (dbReady && sessions.length >= 0) {
      saveSessions(sessions)
    }
  }, [sessions, dbReady])

  const startNewSession = async () => {
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      intervals: [],
      isActive: true
    }
    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    await saveSessions(updatedSessions)
    navigate({ to: '/session/$sessionId/active', params: { sessionId: newSession.id } })
  }

  const addManualSession = async (session: Session) => {
    const updatedSessions = [session, ...sessions].sort((a, b) =>
      b.startTime.getTime() - a.startTime.getTime()
    )
    setSessions(updatedSessions)
    await saveSessions(updatedSessions)
    navigate({ to: '/session/$sessionId/details', params: { sessionId: session.id } })
  }
  return (
    <SessionList
      sessions={sessions}
      onStartNewSession={startNewSession}
      onAddManualSession={addManualSession}
    />
  )
}

