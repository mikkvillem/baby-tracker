import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { SessionList } from '../components/SessionList'
import { loadSessions, putSession, saveMiscEvent, initDB } from '../db'
import type { Session, MiscEvent } from '../app'

export const Route = createFileRoute('/')({
  component: SessionListRoute
})

function SessionListRoute() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    initDB().then(() => {
      loadSessions().then(loadedSessions => {
        const sortedSessions = loadedSessions.sort((a, b) =>
          b.startTime.getTime() - a.startTime.getTime()
        )
        setSessions(sortedSessions)
      })
    })
  }, [])

  const startNewSession = async () => {
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      intervals: [],
      isActive: true
    }
    await putSession(newSession)
    setSessions([newSession, ...sessions])
    navigate({ to: '/session/$sessionId/active', params: { sessionId: newSession.id } })
  }

  const addManualSession = async (session: Session) => {
    await putSession(session)
    setSessions([session, ...sessions].sort((a, b) =>
      b.startTime.getTime() - a.startTime.getTime()
    ))
    navigate({ to: '/session/$sessionId/details', params: { sessionId: session.id } })
  }

  const addMiscEvent = async (event: MiscEvent) => {
    await saveMiscEvent(event)
  }

  return (
    <SessionList
      sessions={sessions}
      onStartNewSession={startNewSession}
      onAddManualSession={addManualSession}
      onAddMiscEvent={addMiscEvent}
    />
  )
}

