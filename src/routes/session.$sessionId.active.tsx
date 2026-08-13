import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { ActiveSession } from '../components/ActiveSession'
import { ErrorBanner } from '../components/ErrorBanner'
import { loadSessions } from '../db'
import { updateSessionIntervals, endSession as endSessionService } from '../services/sessionService'
import type { Session, Interval } from '../app'
import { translations } from '../i18n'

export const Route = createFileRoute('/session/$sessionId/active')({
  component: ActiveSessionRoute
})

function ActiveSessionRoute() {
  const { sessionId } = Route.useParams()
  const navigate = useNavigate()
  const t = translations.value.activeSession
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
        setError(t.errorLoad)
      })
  }, [sessionId, navigate])

  const endSession = async () => {
    if (session) {
      try {
        await endSessionService(sessionId)
        navigate({ to: '/' })
      } catch (err) {
        console.error('Failed to end session:', err)
        setError(t.errorEnd)
      }
    }
  }

  const updateSession = async (id: string, intervals: Interval[]) => {
    try {
      const updated = await updateSessionIntervals(id, intervals)
      if (updated) setSession(updated)
    } catch (err) {
      console.error('Failed to update session:', err)
      setError(t.errorUpdate)
    }
  }

  if (!session) {
    return error ? (
      <div class="max-w-lg mx-auto px-4 pt-4">
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </div>
    ) : (
      <div>{translations.value.common.loading}</div>
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
