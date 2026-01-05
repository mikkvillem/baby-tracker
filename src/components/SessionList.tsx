import { useState, useMemo } from 'preact/hooks'
import type { Session } from '../app'
import { ManualSessionModal } from './ManualSessionModal'
import { FeedingSettingsModal } from './FeedingSettingsModal'
import { NextFeedingCard } from './NextFeedingCard'
import './SessionList.css'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  sessions: Session[]
  onStartNewSession: () => void
  onAddManualSession: (session: Session) => void
}

type GroupedSessions = {
  date: string
  displayDate: string
  sessions: Session[]
}

export function SessionList({ sessions, onStartNewSession, onAddManualSession }: Props) {
  const navigate = useNavigate()
  const [visibleDays, setVisibleDays] = useState(1)
  const [showManualModal, setShowManualModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const formatDuration = (intervals: Session['intervals']) => {
    const total = intervals.reduce((sum, interval) => {
      if (!interval.endTime) return sum
      return sum + (interval.endTime.getTime() - interval.startTime.getTime())
    }, 0)
    const minutes = Math.floor(total / 60000)
    return `${minutes} min`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSideCounts = (intervals: Session['intervals']) => {
    const left = intervals.filter(i => i.side === 'left').length
    const right = intervals.filter(i => i.side === 'right').length
    return { left, right }
  }

  const groupedSessions = useMemo(() => {
    const groups = new Map<string, GroupedSessions>()

    sessions.forEach(session => {
      const date = new Date(session.startTime)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString()

      if (!groups.has(dateKey)) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        let displayDate: string
        if (date.getTime() === today.getTime()) {
          displayDate = 'Today'
        } else if (date.getTime() === yesterday.getTime()) {
          displayDate = 'Yesterday'
        } else {
          displayDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })
        }

        groups.set(dateKey, {
          date: dateKey,
          displayDate,
          sessions: []
        })
      }

      groups.get(dateKey)!.sessions.push(session)
    })

    return Array.from(groups.values()).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [sessions])

  const getInitialVisibleDays = () => {
    let sessionCount = 0
    let daysNeeded = 0
    for (const group of groupedSessions) {
      daysNeeded++
      sessionCount += group.sessions.length
      if (sessionCount >= 4) break
    }
    return Math.max(daysNeeded, 1)
  }

  const initialDays = useMemo(() => getInitialVisibleDays(), [groupedSessions])

  const visibleGroups = groupedSessions.slice(0, Math.max(visibleDays, initialDays))
  const hasMore = Math.max(visibleDays, initialDays) < groupedSessions.length

  const loadMore = () => {
    setVisibleDays(prev => prev + 1)
  }

  const handleManualSave = (session: Session) => {
    onAddManualSession(session)
    setShowManualModal(false)
  }

  return (
    <div class="sessionListContainer">
      <header class="sessionListHeader">
        <h1>Feeding Sessions</h1>
        <div class="headerButtons">
          <button class="manualSessionButton" onClick={() => setShowManualModal(true)}>
            + Manual
          </button>
          <button class="startSessionButton" onClick={onStartNewSession}>
            + New Session
          </button>
        </div>
      </header>

      <NextFeedingCard
        sessions={sessions}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <div class="sessionsList">
        {sessions.length === 0 ? (
          <div class="emptyState">
            <p>No sessions yet</p>
            <p>Start tracking your baby's feeding</p>
          </div>
        ) : (
          <>
            {visibleGroups.map(group => (
              <div key={group.date} class="sessionGroup">
                <h2 class="dateHeader">{group.displayDate}</h2>
                <div class="groupSessions">
                  {group.sessions.map(session => {
                    const { left, right } = getSideCounts(session.intervals)
                    return (
                      <div
                        key={session.id}
                        class='sessionCard clickable'
                        onClick={() => navigate({ to: `/session/${session.id}/${session.isActive ? 'active' : 'details'}` })}
                      >
                        <div class="sessionCardHeader">
                          <span class="sessionTime">{formatTime(session.startTime)}</span>
                          {session.isActive && <span class="activeIndicator">Active</span>}
                        </div>
                        <div class="sessionStats">
                          <span>Duration: {formatDuration(session.intervals)}</span>
                          <span>Left: {left} | Right: {right}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            {hasMore && (
              <button class="loadMoreButton" onClick={loadMore}>
                Load Previous Day
              </button>
            )}
          </>
        )}
      </div>

      {showManualModal && (
        <ManualSessionModal
          onClose={() => setShowManualModal(false)}
          onSave={handleManualSave}
        />
      )}

      {showSettingsModal && (
        <FeedingSettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}

