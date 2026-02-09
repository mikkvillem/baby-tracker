import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { SessionDetails } from '../components/SessionDetails'
import { loadSessions } from '../db'
import { updateSessionIntervals, deleteSession as deleteSessionService } from '../services/sessionService'
import type { Session, Interval } from '../app'

export const Route = createFileRoute('/session/$sessionId/details')({
  component: SessionDetailsRoute
})

function SessionDetailsRoute() {
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

  const backToList = () => {
    navigate({ to: '/' })
  }

  const updateSession = async (id: string, intervals: Interval[]) => {
    const updated = await updateSessionIntervals(id, intervals)
    if (updated) setSession(updated)
  }

  const deleteSession = async (id: string) => {
    await deleteSessionService(id)
    navigate({ to: '/' })
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SessionDetails
        session={session}
        onBack={backToList}
        onUpdateSession={updateSession}
        onDeleteSession={deleteSession}
      />
    </>
  )
}
