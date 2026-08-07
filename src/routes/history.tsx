import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { loadSessions, loadMiscEvents, deleteMiscEvent, initDB, exportDataAsJSON } from '../db'
import type { Session, MiscEvent } from '../app'
import { formatDurationMin, formatDurationShort, getSideCounts } from '../utils/sessionFormatters'
import { ErrorBanner } from '../components/ErrorBanner'
import { Download, ChevronRight, X, Baby, Pill, Ruler, PenLine, Droplets } from 'lucide-preact'

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
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const loadData = () => {
    initDB()
      .then(() => Promise.all([loadSessions(), loadMiscEvents()]))
      .then(([loadedSessions, loadedEvents]) => {
        const sortedSessions = loadedSessions.sort((a, b) =>
          b.startTime.getTime() - a.startTime.getTime()
        )
        const sortedEvents = loadedEvents.sort((a, b) =>
          b.timestamp.getTime() - a.timestamp.getTime()
        )
        setSessions(sortedSessions)
        setMiscEvents(sortedEvents)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load history:', err)
        setError('Failed to load your history. Please reload the page and try again.')
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
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

  // Auto-expand the first day (today/most recent)
  useEffect(() => {
    if (visibleGroups.length > 0 && expandedDays.size === 0) {
      setExpandedDays(new Set([visibleGroups[0].date]))
    }
  }, [visibleGroups.length])

  const loadMore = () => {
    setVisibleDays(prev => prev + 1)
  }

  const toggleDay = (dateKey: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey)
      } else {
        newSet.add(dateKey)
      }
      return newSet
    })
  }

  const getFeedTimesForDay = (items: TimelineItem[]) => {
    let leftMs = 0
    let rightMs = 0
    items.forEach(item => {
      if (item.type === 'session') {
        item.data.intervals.forEach(interval => {
          if (interval.endTime) {
            const duration = interval.endTime.getTime() - interval.startTime.getTime()
            if (interval.side === 'left') leftMs += duration
            else rightMs += duration
          }
        })
      }
    })
    return {
      left: formatDurationShort(leftMs),
      right: formatDurationShort(rightMs),
      total: formatDurationShort(leftMs + rightMs)
    }
  }

  const handleExport = async () => {
    try {
      await exportDataAsJSON()
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'diaper': return <Droplets size={16} />
      case 'medicine':
      case 'vitamin':
      case 'probiotic': return <Pill size={16} />
      case 'measurement': return <Ruler size={16} />
      default: return <PenLine size={16} />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'diaper': return 'bg-warning-500'
      case 'medicine':
      case 'vitamin':
      case 'probiotic': return 'bg-event-medicine'
      case 'measurement': return 'bg-success-500'
      default: return 'bg-event-custom'
    }
  }

  return (
    <div class="max-w-lg mx-auto px-4 pt-4 pb-6 flex flex-col gap-4">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <h1 class="m-0 text-xl font-semibold text-surface-800 dark:text-surface-100">History</h1>
        <button
          class="flex items-center gap-1.5 text-primary-500 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-primary-600 transition-colors p-0"
          onClick={handleExport}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {sessions.length === 0 && miscEvents.length === 0 ? (
        <div class="text-center py-16 px-5 text-surface-400">
          <Baby size={40} class="mx-auto mb-3 opacity-50" />
          <p class="text-base font-medium mb-1 m-0">No activity yet</p>
          <p class="text-sm m-0">Start tracking to see your history</p>
        </div>
      ) : (
        <>
          {visibleGroups.map(group => {
            const isExpanded = expandedDays.has(group.date)
            const feedTimes = getFeedTimesForDay(group.items)

            return (
              <div key={group.date} class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                <button
                  class="w-full px-4 py-3.5 flex justify-between items-center cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-200 gap-3 bg-transparent border-none text-left"
                  onClick={() => toggleDay(group.date)}
                >
                  <div class="flex items-center gap-2.5">
                    <ChevronRight size={16} class={`text-surface-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    <h2 class="m-0 text-base font-semibold text-surface-800 dark:text-surface-100">{group.displayDate}</h2>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-medium shrink-0">
                    <span class="text-side-left-500">{feedTimes.left}</span>
                    <span class="text-surface-300 dark:text-surface-600">/</span>
                    <span class="text-side-right-500">{feedTimes.right}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div class="flex flex-col divide-y divide-surface-100 dark:divide-surface-700 border-t border-surface-100 dark:border-surface-700">
                    {group.items.map((item) => {
                      if (item.type === 'session') {
                        const session = item.data
                        const { left, right } = getSideCounts(session.intervals)
                        return (
                          <div
                            key={session.id}
                            class="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-200"
                            onClick={() => navigate({ to: `/session/${session.id}/${session.isActive ? 'active' : 'details'}` })}
                          >
                            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
                              <Baby size={16} class="text-primary-500" />
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-surface-800 dark:text-surface-100">{formatTime(session.startTime)}</span>
                                {session.isActive && (
                                  <span class="bg-success-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div class="text-xs text-surface-500 mt-0.5">
                                {formatDurationMin(session.intervals)} · L{left} R{right}
                              </div>
                            </div>
                            <ChevronRight size={16} class="text-surface-300 dark:text-surface-600 shrink-0" />
                          </div>
                        )
                      } else {
                        const event = item.data
                        let label: string
                        if (event.type === 'custom') label = event.customLabel ?? 'Custom'
                        else if (event.type === 'medicine') label = event.medicineName ?? 'Medicine'
                        else if (event.type === 'vitamin') label = 'Vitamin D'
                        else if (event.type === 'probiotic') label = 'Probiotic'
                        else if (event.type === 'measurement' && event.measurementKind != null && event.measurementValue != null) {
                          const kindLabels = { weight: 'Weight', height: 'Height', headCircumference: 'Head' }
                          const unit = event.measurementUnit ?? (event.measurementKind === 'weight' ? 'kg' : 'cm')
                          label = `${kindLabels[event.measurementKind]} ${event.measurementValue} ${unit}`
                        } else if (event.type === 'measurement') label = 'Measurement'
                        else if (event.type === 'diaper') {
                          const parts = []
                          if (event.diaperPoop) parts.push('poop')
                          if (event.diaperPee) parts.push('pee')
                          label = parts.length > 0 ? `Diaper (${parts.join(', ')})` : 'Diaper'
                        } else label = 'Diaper'
                        return (
                          <div
                            key={event.id}
                            class="px-4 py-3 flex items-center gap-3"
                          >
                            <div class={`w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center text-white shrink-0`}>
                              {getEventIcon(event.type)}
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-surface-800 dark:text-surface-100">{formatTime(event.timestamp)}</span>
                              </div>
                              <div class="text-xs text-surface-500 mt-0.5">{label}</div>
                            </div>
                            <button
                              class="w-7 h-7 flex items-center justify-center bg-transparent border-none text-surface-300 dark:text-surface-600 hover:text-danger-500 cursor-pointer transition-colors rounded-md p-0"
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm('Delete this event?')) {
                                  try {
                                    await deleteMiscEvent(event.id)
                                    loadData()
                                  } catch (err) {
                                    console.error('Failed to delete event:', err)
                                    setError('Failed to delete the event. Please try again.')
                                  }
                                }
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                      }
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {hasMore && (
            <button
              class="w-full bg-white dark:bg-surface-800 text-surface-500 border border-surface-200 dark:border-surface-700 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-surface-50 dark:hover:bg-surface-700 hover:border-surface-300 active:scale-[0.98]"
              onClick={loadMore}
            >
              Load Previous Day
            </button>
          )}
        </>
      )}
    </div>
  )
}
