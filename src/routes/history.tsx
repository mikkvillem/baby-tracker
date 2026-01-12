import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { loadSessions, initDB, exportDataAsJSON } from '../db'
import type { Session } from '../app'

export const Route = createFileRoute('/history')({
  component: HistoryRoute
})

type GroupedSessions = {
  date: string
  displayDate: string
  sessions: Session[]
}

function HistoryRoute() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [visibleDays, setVisibleDays] = useState(3)

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

  const visibleGroups = groupedSessions.slice(0, visibleDays)
  const hasMore = visibleDays < groupedSessions.length

  const loadMore = () => {
    setVisibleDays(prev => prev + 1)
  }

  const handleExport = async () => {
    try {
      await exportDataAsJSON()
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  return (
    <div class="max-w-2xl mx-auto px-4 sm:px-5">
      <header class="flex items-center gap-3 mb-6 flex-wrap">
        <button 
          class="bg-white border border-gray-200 px-3 sm:px-4 py-2 rounded-lg text-base font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
          onClick={() => navigate({ to: '/' })}
        >
          ← Back
        </button>
        <h1 class="m-0 text-2xl sm:text-3xl font-semibold flex-1">History</h1>
        <button 
          class="bg-blue-500 text-white border-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600 flex items-center gap-2"
          onClick={handleExport}
        >
          <span>📥</span>
          <span>Export</span>
        </button>
      </header>

      <div class="flex flex-col gap-6">
        {sessions.length === 0 ? (
          <div class="text-center py-12 px-5 text-gray-500 bg-white rounded-xl border border-gray-200">
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
    </div>
  )
}

