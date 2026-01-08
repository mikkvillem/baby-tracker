import { useState, useMemo } from 'preact/hooks'
import type { Session } from '../app'
import { ManualSessionModal } from './ManualSessionModal'
import { FeedingSettingsModal } from './FeedingSettingsModal'
import { NextFeedingCard } from './NextFeedingCard'
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
    <div class="max-w-2xl mx-auto px-4 sm:px-5">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold m-0">Feeding Sessions</h1>
        <div class="flex gap-3 w-full sm:w-auto">
          <button
            class="flex-1 sm:flex-none bg-gray-500 text-white border-none px-4 sm:px-5 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-600 active:scale-[0.98]"
            onClick={() => setShowManualModal(true)}
          >
            + Manual
          </button>
          <button
            class="flex-1 sm:flex-none bg-emerald-500 text-white border-none px-5 sm:px-6 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98]"
            onClick={onStartNewSession}
          >
            + New Session
          </button>
        </div>
      </header>

      <NextFeedingCard
        sessions={sessions}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <div class="flex flex-col gap-6">
        {sessions.length === 0 ? (
          <div class="text-center py-12 sm:py-15 px-5 text-gray-500">
            <p class="text-lg font-medium mb-2">No sessions yet</p>
            <p class="text-sm">Start tracking your baby's feeding</p>
          </div>
        ) : (
          <>
            {visibleGroups.map(group => (
              <div key={group.date} class="flex flex-col gap-3">
                <h2 class="m-0 text-lg font-semibold text-gray-700 pl-1">{group.displayDate}</h2>
                <div class="flex flex-col gap-3">
                  {group.sessions.map(session => {
                    const { left, right } = getSideCounts(session.intervals)
                    return (
                      <div
                        key={session.id}
                        class="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-gray-300"
                        onClick={() => navigate({ to: `/session/${session.id}/${session.isActive ? 'active' : 'details'}` })}
                      >
                        <div class="flex justify-between items-center mb-3">
                          <span class="text-lg font-semibold">{formatTime(session.startTime)}</span>
                          {session.isActive && (
                            <span class="bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div class="flex gap-4 text-gray-500 text-sm">
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
              <button
                class="w-full bg-white text-gray-500 border border-gray-200 px-5 sm:px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 active:scale-[0.98]"
                onClick={loadMore}
              >
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

