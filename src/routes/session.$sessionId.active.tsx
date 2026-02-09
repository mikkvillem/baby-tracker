import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { ActiveSession } from '../components/ActiveSession'
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

  useEffect(() => {
    loadSessions().then(sessions => {
      const foundSession = sessions.find(s => s.id === sessionId)
      if (foundSession) {
        setSession(foundSession)
      } else {
        navigate({ to: '/' })
      }
    })
  }, [sessionId, navigate])

  const endSession = async () => {
    if (session) {
      await endSessionService(sessionId)
      navigate({ to: '/' })
    }
  }

  const updateSession = async (id: string, intervals: Interval[]) => {
    const updated = await updateSessionIntervals(id, intervals)
    if (updated) setSession(updated)
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <ActiveSession
      session={session}
      onEndSession={endSession}
      onUpdateSession={updateSession}
    />
  )
}
