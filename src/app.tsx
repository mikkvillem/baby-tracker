import { useState, useEffect } from 'preact/hooks'
import { SessionList } from './components/SessionList'
import { ActiveSession } from './components/ActiveSession'
import { SessionDetails } from './components/SessionDetails'
import { initDB, loadSessions, saveSessions } from './db'
import './app.css'

export type Session = {
  id: string
  startTime: Date
  intervals: Interval[]
  isActive: boolean
}

export type Interval = {
  side: 'left' | 'right'
  startTime: Date
  endTime?: Date
}

export function App() {
  const [currentView, setCurrentView] = useState<'list' | 'active' | 'details'>('list')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initDB().then(() => {
      loadSessions().then(loadedSessions => {
        const sortedSessions = loadedSessions.sort((a, b) => 
          b.startTime.getTime() - a.startTime.getTime()
        )
        setSessions(sortedSessions)
        
        const active = sortedSessions.find(s => s.isActive)
        if (active) {
          setActiveSessionId(active.id)
          setCurrentView('active')
        }
        
        setDbReady(true)
      })
    })
  }, [])

  useEffect(() => {
    if (dbReady && sessions.length >= 0) {
      saveSessions(sessions)
    }
  }, [sessions, dbReady])

  const startNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      intervals: [],
      isActive: true
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setCurrentView('active')
  }

  const endSession = () => {
    if (activeSessionId) {
      setSessions(prev => 
        prev.map(s => 
          s.id === activeSessionId ? { ...s, isActive: false } : s
        )
      )
      setActiveSessionId(null)
      setCurrentView('list')
    }
  }

  const updateSession = (sessionId: string, intervals: Interval[]) => {
    setSessions(prev => 
      prev.map(s => 
        s.id === sessionId ? { ...s, intervals } : s
      )
    )
  }

  const viewSession = (sessionId: string) => {
    setViewingSessionId(sessionId)
    setCurrentView('details')
  }

  const backToList = () => {
    setViewingSessionId(null)
    setCurrentView('list')
  }

  const activeSession = sessions.find(s => s.id === activeSessionId)
  const viewingSession = sessions.find(s => s.id === viewingSessionId)

  return (
    <div class="app">
      {currentView === 'list' ? (
        <SessionList 
          sessions={sessions}
          onStartNewSession={startNewSession}
          onViewSession={viewSession}
        />
      ) : currentView === 'active' ? (
        <ActiveSession 
          session={activeSession!}
          onEndSession={endSession}
          onUpdateSession={updateSession}
        />
      ) : (
        <SessionDetails
          session={viewingSession!}
          onBack={backToList}
          onUpdateSession={updateSession}
        />
      )}
    </div>
  )
}
