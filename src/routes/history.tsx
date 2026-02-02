import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { loadSessions, loadMiscEvents, deleteMiscEvent, initDB, exportDataAsJSON } from '../db'
import type { Session, MiscEvent } from '../app'

export const Route = createFileRoute('/history')({
  component: HistoryRoute
})

type TimelineItem =
  | { type: 'session'; data: Session }
  | { type: 'event'; data: MiscEvent }

type GroupedTimeline = {
  date: string
  displayDate: string
  items: TimelineItem[]
}

function HistoryRoute() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [miscEvents, setMiscEvents] = useState<MiscEvent[]>([])
  const [visibleDays, setVisibleDays] = useState(3)

  const loadData = () => {
    initDB().then(() => {
      Promise.all([loadSessions(), loadMiscEvents()]).then(([loadedSessions, loadedEvents]) => {
        const sortedSessions = loadedSessions.sort((a, b) =>
          b.startTime.getTime() - a.startTime.getTime()
        )
        const sortedEvents = loadedEvents.sort((a, b) =>
          b.timestamp.getTime() - a.timestamp.getTime()
        )
        setSessions(sortedSessions)
        setMiscEvents(sortedEvents)
      })
    })
  }

  useEffect(() => {
    loadData()
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
      minute: '2-digit',
      hour12: false
    })
  }

  const getSideCounts = (intervals: Session['intervals']) => {
    const left = intervals.filter(i => i.side === 'left').length
    const right = intervals.filter(i => i.side === 'right').length
    return { left, right }
  }

  const groupedTimeline = useMemo(() => {
    const groups = new Map<string, GroupedTimeline>()

    // Add sessions
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
          items: []
        })
      }

      groups.get(dateKey)!.items.push({ type: 'session', data: session })
    })

    // Add misc events
    miscEvents.forEach(event => {
      const date = new Date(event.timestamp)
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
          items: []
        })
      }

      groups.get(dateKey)!.items.push({ type: 'event', data: event })
    })

    // Sort items within each day by timestamp
    groups.forEach(group => {
      group.items.sort((a, b) => {
        const timeA = a.type === 'session' ? a.data.startTime.getTime() : a.data.timestamp.getTime()
        const timeB = b.type === 'session' ? b.data.startTime.getTime() : b.data.timestamp.getTime()
        return timeB - timeA
      })
    })

    return Array.from(groups.values()).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [sessions, miscEvents])

  const visibleGroups = groupedTimeline.slice(0, visibleDays)
  const hasMore = visibleDays < groupedTimeline.length

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
        {sessions.length === 0 && miscEvents.length === 0 ? (
          <div class="text-center py-12 px-5 text-gray-500 bg-white rounded-xl border border-gray-200">
            <p class="text-lg font-medium mb-2">No activity yet</p>
            <p class="text-sm">Start tracking your baby's feeding and events</p>
          </div>
        ) : (
          <>
            {visibleGroups.map(group => (
              <div key={group.date} class="flex flex-col gap-3">
                <h2 class="m-0 text-lg font-semibold text-gray-700 pl-1">{group.displayDate}</h2>
                <div class="flex flex-col gap-3">
                  {group.items.map((item, idx) => {
                    if (item.type === 'session') {
                      const session = item.data
                      const { left, right } = getSideCounts(session.intervals)
                      return (
                        <div
                          key={session.id}
                          class="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-gray-300"
                          onClick={() => navigate({ to: `/session/${session.id}/${session.isActive ? 'active' : 'details'}` })}
                        >
                          <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center gap-2">
                              <span class="text-lg">🍼</span>
                              <span class="text-lg font-semibold">{formatTime(session.startTime)}</span>
                            </div>
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
                    } else {
                      const event = item.data
                      const emoji = event.type === 'diaper' ? '🚼' :
                        event.type === 'vitamin' ? '💊' :
                          event.type === 'probiotic' ? '🦠' : '✏️'
                      const label = event.type === 'custom' ? event.customLabel :
                        event.type === 'vitamin' ? 'Vitamin D' :
                          event.type === 'probiotic' ? 'Probiotic' :
                            'Diaper'
                      return (
                        <div
                          key={event.id}
                          class="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200"
                        >
                          <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                              <span class="text-lg">{emoji}</span>
                              <span class="text-base font-semibold">{formatTime(event.timestamp)}</span>
                              <span class="text-gray-600">•</span>
                              <span class="text-gray-700">{label}</span>
                            </div>
                            <button
                              class="text-gray-400 hover:text-red-500 text-xl leading-none transition-colors duration-200"
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm('Delete this event?')) {
                                  await deleteMiscEvent(event.id)
                                  loadData()
                                }
                              }}
                            >
                              ×
                            </button>
                          </div>
                          {event.notes && (
                            <p class="text-sm text-gray-500 mt-2 mb-0 ml-7">{event.notes}</p>
                          )}
                        </div>
                      )
                    }
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

