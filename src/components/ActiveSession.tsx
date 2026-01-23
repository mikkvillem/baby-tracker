import { useState, useEffect, useCallback } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { useBeforeUnload } from '../hooks/useBeforeUnload'

type Props = {
  session: Session
  onEndSession: () => void
  onUpdateSession: (sessionId: string, intervals: Interval[]) => void
}

export function ActiveSession({ session, onEndSession, onUpdateSession }: Props) {
  const [activeLeft, setActiveLeft] = useState(false)
  const [activeRight, setActiveRight] = useState(false)
  const [intervals, setIntervals] = useState<Interval[]>(session.intervals)
  const [currentIntervalStart, setCurrentIntervalStart] = useState<Date | null>(null)

  const saveOnUnload = useCallback(() => {
    if (activeLeft || activeRight) {
      onUpdateSession(session.id, intervals)
    }
  }, [activeLeft, activeRight, intervals, session.id, onUpdateSession])

  useBeforeUnload(saveOnUnload, activeLeft || activeRight)

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    let timer: number
    if (activeLeft || activeRight) {
      timer = setInterval(() => {
        forceUpdate(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [activeLeft, activeRight])

  const getTotalTimeForSide = (side: 'left' | 'right'): number => {
    const completedTime = intervals
      .filter(i => i.side === side && i.endTime)
      .reduce((sum, i) => sum + (i.endTime!.getTime() - i.startTime.getTime()), 0)
    
    const activeTime = (side === 'left' && activeLeft) || (side === 'right' && activeRight)
      ? currentIntervalStart ? Date.now() - currentIntervalStart.getTime() : 0
      : 0
    
    return Math.floor((completedTime + activeTime) / 1000)
  }

  const toggleLeft = () => {
    if (activeLeft) {
      const updatedIntervals = intervals.map((interval, idx) => 
        idx === intervals.length - 1 && interval.side === 'left' && !interval.endTime
          ? { ...interval, endTime: new Date() }
          : interval
      )
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActiveLeft(false)
    } else {
      let updatedIntervals = intervals
      
      if (activeRight) {
        updatedIntervals = intervals.map((interval, idx) => 
          idx === intervals.length - 1 && interval.side === 'right' && !interval.endTime
            ? { ...interval, endTime: new Date() }
            : interval
        )
        setActiveRight(false)
      }
      
      const now = new Date()
      const newInterval: Interval = {
        side: 'left',
        startTime: now
      }
      updatedIntervals = [...updatedIntervals, newInterval]
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActiveLeft(true)
      setCurrentIntervalStart(now)
    }
  }

  const toggleRight = () => {
    if (activeRight) {
      const updatedIntervals = intervals.map((interval, idx) => 
        idx === intervals.length - 1 && interval.side === 'right' && !interval.endTime
          ? { ...interval, endTime: new Date() }
          : interval
      )
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActiveRight(false)
    } else {
      let updatedIntervals = intervals
      
      if (activeLeft) {
        updatedIntervals = intervals.map((interval, idx) => 
          idx === intervals.length - 1 && interval.side === 'left' && !interval.endTime
            ? { ...interval, endTime: new Date() }
            : interval
        )
        setActiveLeft(false)
      }
      
      const now = new Date()
      const newInterval: Interval = {
        side: 'right',
        startTime: now
      }
      updatedIntervals = [...updatedIntervals, newInterval]
      setIntervals(updatedIntervals)
      onUpdateSession(session.id, updatedIntervals)
      setActiveRight(true)
      setCurrentIntervalStart(now)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    const total = intervals.reduce((sum, interval) => {
      if (!interval.endTime) return sum
      return sum + (interval.endTime.getTime() - interval.startTime.getTime())
    }, 0)
    const minutes = Math.floor(total / 60000)
    return `${minutes} min`
  }

  const deleteInterval = (index: number) => {
    const updatedIntervals = intervals.filter((_, idx) => idx !== index)
    setIntervals(updatedIntervals)
    onUpdateSession(session.id, updatedIntervals)
  }

  const formatIntervalDuration = (startTime: Date, endTime: Date) => {
    const totalSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${secs}s`
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
        <p class="m-0 font-medium">Total: {getTotalDuration()}</p>
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
            onClick={toggleLeft}
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
            onClick={toggleRight}
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
              <div key={idx} class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                <span class={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                  interval.side === 'left' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {interval.side === 'left' ? 'L' : 'R'}
                </span>
                <span class="text-xs sm:text-sm">{interval.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                {interval.endTime && (
                  <span class="ml-auto font-semibold text-emerald-500">
                    {formatIntervalDuration(interval.startTime, interval.endTime)}
                  </span>
                )}
                {interval.endTime && (
                  <button 
                    class="w-7 h-7 border-none bg-red-100 text-red-600 rounded-md text-xl leading-none cursor-pointer transition-all duration-200 hover:bg-red-200 hover:scale-110 active:scale-95 flex items-center justify-center p-0"
                    onClick={() => deleteInterval(idx)}
                    title="Delete interval"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

