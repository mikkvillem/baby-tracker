import { useState, useEffect, useCallback } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { useBeforeUnload } from '../hooks/useBeforeUnload'
import './ActiveSession.css'

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
    <div class="activeSessionContainer">
      <header class="activeSessionHeader">
        <h1>Active Session</h1>
        <button class="endSessionButton" onClick={onEndSession}>
          End Session
        </button>
      </header>

      <div class="sessionSummary">
        <p>Total: {getTotalDuration()}</p>
        <p>Started: {intervals.length > 0 ? intervals[0].startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ' - '}</p>
      </div>

      <div class="timerControls">
        <div class="timerControl">
          <h2>Left</h2>
          <div class="timerDisplay">{formatTimer(getTotalTimeForSide('left'))}</div>
          <button 
            class={`timerButton ${activeLeft ? 'active' : ''}`}
            onClick={toggleLeft}
          >
            {activeLeft ? 'Stop' : 'Start'}
          </button>
        </div>

        <div class="timerControl">
          <h2>Right</h2>
          <div class="timerDisplay">{formatTimer(getTotalTimeForSide('right'))}</div>
          <button 
            class={`timerButton ${activeRight ? 'active' : ''}`}
            onClick={toggleRight}
          >
            {activeRight ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      <div class="intervalHistory">
        <h3>Session History</h3>
        {intervals.length === 0 ? (
          <p class="emptyHistory">No intervals yet</p>
        ) : (
          <div class="intervalsList">
            {intervals.map((interval, idx) => (
              <div key={idx} class="intervalItem">
                <span class={`intervalSide ${interval.side}`}>
                  {interval.side === 'left' ? 'L' : 'R'}
                </span>
                <span>{interval.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                {interval.endTime && (
                  <span class="intervalDuration">
                    {formatIntervalDuration(interval.startTime, interval.endTime)}
                  </span>
                )}
                {interval.endTime && (
                  <button 
                    class="deleteIntervalButton"
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

