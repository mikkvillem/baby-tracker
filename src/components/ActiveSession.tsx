import { useState, useCallback } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { useBeforeUnload } from '../hooks/useBeforeUnload'
import { useIntervalTick } from '../hooks/useIntervalTick'
import {
  getTotalTimeForSide as getTotalTimeForSideUtil,
  formatDurationMin,
  formatTimer
} from '../utils/sessionFormatters'
import { IntervalRow } from './IntervalRow'

type Props = {
  session: Session
  onEndSession: () => void
  onUpdateSession: (sessionId: string, intervals: Interval[]) => void
}

function getResumedState(intervals: Interval[]) {
  const last = intervals[intervals.length - 1]
  const open = last && !last.endTime
  return open
    ? { activeSide: last!.side as 'left' | 'right', startTime: last!.startTime }
    : null
}

export function ActiveSession({ session, onEndSession, onUpdateSession }: Props) {
  const resumed = getResumedState(session.intervals)
  const [activeLeft, setActiveLeft] = useState(resumed?.activeSide === 'left')
  const [activeRight, setActiveRight] = useState(resumed?.activeSide === 'right')
  const [intervals, setIntervals] = useState<Interval[]>(session.intervals)
  const [currentIntervalStart, setCurrentIntervalStart] = useState<Date | null>(resumed?.startTime ?? null)

  const saveOnUnload = useCallback(() => {
    if (activeLeft || activeRight) {
      onUpdateSession(session.id, intervals)
    }
  }, [activeLeft, activeRight, intervals, session.id, onUpdateSession])

  useBeforeUnload(saveOnUnload, activeLeft || activeRight)
  useIntervalTick(activeLeft || activeRight, 1000)

  const getTotalTimeForSide = (side: 'left' | 'right') =>
    getTotalTimeForSideUtil(intervals, side, {
      activeSide: activeLeft ? 'left' : activeRight ? 'right' : undefined,
      currentIntervalStart: activeLeft || activeRight ? currentIntervalStart : null
    })

  const toggleSide = (side: 'left' | 'right') => {
    const isActive = side === 'left' ? activeLeft : activeRight
    const otherSide = side === 'left' ? 'right' : 'left'
    const setActive = side === 'left' ? setActiveLeft : setActiveRight
    const setOtherActive = side === 'left' ? setActiveRight : setActiveLeft

    if (isActive) {
      const updatedIntervals = intervals.map((interval, idx) =>
        idx === intervals.length - 1 && interval.side === side && !interval.endTime
          ? { ...interval, endTime: new Date() }
          : interval
      )
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActive(false)
    } else {
      let updatedIntervals = intervals
      if (side === 'left' ? activeRight : activeLeft) {
        updatedIntervals = intervals.map((interval, idx) =>
          idx === intervals.length - 1 && interval.side === otherSide && !interval.endTime
            ? { ...interval, endTime: new Date() }
            : interval
        )
        setOtherActive(false)
      }
      const now = new Date()
      updatedIntervals = [...updatedIntervals, { side, startTime: now }]
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActive(true)
      setCurrentIntervalStart(now)
    }
  }

  const deleteInterval = (index: number) => {
    const updatedIntervals = intervals.filter((_, idx) => idx !== index)
    setIntervals(updatedIntervals)
    onUpdateSession(session.id, updatedIntervals)
  }

  return (
    <div class="max-w-2xl mx-auto px-4 sm:px-5">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold m-0">Active Session</h1>
        <button 
          class="w-full sm:w-auto bg-red-500 text-white border-none px-5 sm:px-6 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600"
          onClick={onEndSession}
        >
          End Session
        </button>
      </header>

      <div class="bg-gray-50 rounded-xl p-4 mb-6 sm:mb-8 flex justify-around text-base flex-wrap gap-2">
        <p class="m-0 font-medium">Total: {formatDurationMin(intervals)}</p>
        <p class="m-0 font-medium">Started: {intervals.length > 0 ? intervals[0].startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : ' - '}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <div class="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center">
          <h2 class="m-0 mb-4 text-xl font-semibold">Left</h2>
          <div class="text-5xl sm:text-6xl font-bold font-mono mb-4 text-gray-800">
            {formatTimer(getTotalTimeForSide('left'))}
          </div>
          <button 
            class={`w-full py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ${
              activeLeft 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => toggleSide('left')}
          >
            {activeLeft ? 'Stop' : 'Start'}
          </button>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center">
          <h2 class="m-0 mb-4 text-xl font-semibold">Right</h2>
          <div class="text-5xl sm:text-6xl font-bold font-mono mb-4 text-gray-800">
            {formatTimer(getTotalTimeForSide('right'))}
          </div>
          <button 
            class={`w-full py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ${
              activeRight 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => toggleSide('right')}
          >
            {activeRight ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        <h3 class="m-0 mb-4 text-lg font-semibold">Session History</h3>
        {intervals.length === 0 ? (
          <p class="text-center text-gray-500 py-5 m-0">No intervals yet</p>
        ) : (
          <div class="flex flex-col gap-2">
            {intervals.map((interval, idx) => (
              <IntervalRow
                key={idx}
                interval={interval}
                onDelete={interval.endTime ? () => deleteInterval(idx) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

