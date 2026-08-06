import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { SessionList } from '../components/SessionList'
import { ErrorBanner } from '../components/ErrorBanner'
import { loadSessions, saveSessions, saveMiscEvent, initDB } from '../db'
import type { Session, MiscEvent } from '../app'

export const Route = createFileRoute('/')({
  component: SessionListRoute
})

function SessionListRoute() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [dbReady, setDbReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initDB()
      .then(() => loadSessions())
      .then(loadedSessions => {
        const sortedSessions = loadedSessions.sort((a, b) =>
          b.startTime.getTime() - a.startTime.getTime()
        )
        setSessions(sortedSessions)
        setDbReady(true)
      })
      .catch(err => {
        console.error('Failed to load sessions:', err)
        setError('Failed to load your data. Please reload the page and try again.')
      })
  }, [])

  useEffect(() => {
    if (dbReady && sessions.length >= 0) {
      saveSessions(sessions).catch(err => {
        console.error('Failed to save sessions:', err)
        setError('Failed to save your changes. Please try again.')
      })
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
    try {
      await saveSessions(updatedSessions)
      setSessions(updatedSessions)
      navigate({ to: '/session/$sessionId/active', params: { sessionId: newSession.id } })
    } catch (err) {
      console.error('Failed to start session:', err)
      setError('Failed to start a new session. Please try again.')
    }
  }

  const addManualSession = async (session: Session) => {
    const updatedSessions = [session, ...sessions].sort((a, b) =>
      b.startTime.getTime() - a.startTime.getTime()
    )
    try {
      await saveSessions(updatedSessions)
      setSessions(updatedSessions)
      navigate({ to: '/session/$sessionId/details', params: { sessionId: session.id } })
    } catch (err) {
      console.error('Failed to add session:', err)
      setError('Failed to save the session. Please try again.')
    }
  }

  const addMiscEvent = async (event: MiscEvent) => {
    try {
      await saveMiscEvent(event)
    } catch (err) {
      console.error('Failed to save event:', err)
      setError('Failed to save the event. Please try again.')
    }
  }

  return (
    <>
      {error && (
        <div class="max-w-lg mx-auto px-4 pt-4">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      <SessionList
        sessions={sessions}
        onStartNewSession={startNewSession}
        onAddManualSession={addManualSession}
        onAddMiscEvent={addMiscEvent}
      />
    </>
  )
}

