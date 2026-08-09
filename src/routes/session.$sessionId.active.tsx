import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { ActiveSession } from '../components/ActiveSession'
import { ErrorBanner } from '../components/ErrorBanner'
import { loadSessions } from '../db'
import { updateSessionIntervals, endSession as endSessionService } from '../services/sessionService'
import type { Session, Interval } from '../app'

export const Route = createFileRoute('/session/$sessionId/active')({
  component: ActiveSessionRoute
})

function ActiveSessionRoute() {
  const { sessionId } = Route.useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSessions()
      .then(sessions => {
        const foundSession = sessions.find(s => s.id === sessionId)
        if (foundSession) {
          setSession(foundSession)
        } else {
          navigate({ to: '/' })
        }
      })
      .catch(err => {
        console.error('Failed to load session:', err)
        setError('Failed to load this session. Please reload the page and try again.')
      })
  }, [sessionId, navigate])

  const endSession = async () => {
    if (session) {
      try {
        await endSessionService(sessionId)
        navigate({ to: '/' })
      } catch (err) {
        console.error('Failed to end session:', err)
        setError('Failed to end the session. Please try again.')
      }
    }
  }

  const updateSession = async (id: string, intervals: Interval[]) => {
    try {
      const updated = await updateSessionIntervals(id, intervals)
      if (updated) setSession(updated)
    } catch (err) {
      console.error('Failed to update session:', err)
      setError('Failed to save your changes. Please try again.')
    }
  }

  if (!session) {
    return error ? (
      <div class="max-w-lg mx-auto px-4 pt-4">
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </div>
    ) : (
      <div>Loading...</div>
    )
  }

  return (
    <>
      {error && (
        <div class="max-w-lg mx-auto px-4 pt-4">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      <ActiveSession
        session={session}
        onEndSession={endSession}
        onUpdateSession={updateSession}
      />
    </>
  )
}
