import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'preact/hooks'
import { ActiveSession } from '../components/ActiveSession'
import { loadSessions, saveSessions } from '../db'
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

  const endSession = () => {
    if (session) {
      loadSessions().then(sessions => {
        const updatedSessions = sessions.map(s =>
          s.id === sessionId ? { ...s, isActive: false } : s
        )
        saveSessions(updatedSessions).then(() => {
          navigate({ to: '/' })
        })
      })
    }
  }

  const updateSession = (sessionId: string, intervals: Interval[]) => {
    loadSessions().then(sessions => {
      const updatedSessions = sessions.map(s =>
        s.id === sessionId ? { ...s, intervals } : s
      )
      saveSessions(updatedSessions).then(() => {
        const updatedSession = updatedSessions.find(s => s.id === sessionId)
        if (updatedSession) {
          setSession(updatedSession)
        }
      })
    })
  }

  if (!session) {
    return <div>Loading...</div>
  }
  console.log("active session", session)
  return (
    <ActiveSession
      session={session}
      onEndSession={endSession}
      onUpdateSession={updateSession}
    />
  )
}

