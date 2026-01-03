import type { Session, Interval } from '../app'
import './SessionDetails.css'

type Props = {
  session: Session
  onBack: () => void
  onUpdateSession: (sessionId: string, intervals: Interval[]) => void
}

export function SessionDetails({ session, onBack, onUpdateSession }: Props) {
  const formatDuration = (intervals: Interval[]) => {
    const total = intervals.reduce((sum, interval) => {
      if (!interval.endTime) return sum
      return sum + (interval.endTime.getTime() - interval.startTime.getTime())
    }, 0)
    const minutes = Math.floor(total / 60000)
    const seconds = Math.floor((total % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getTotalTimeForSide = (side: 'left' | 'right'): number => {
    const completedTime = session.intervals
      .filter(i => i.side === side && i.endTime)
      .reduce((sum, i) => sum + (i.endTime!.getTime() - i.startTime.getTime()), 0)
    
    return Math.floor(completedTime / 1000)
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const deleteInterval = (index: number) => {
    const updatedIntervals = session.intervals.filter((_, idx) => idx !== index)
    onUpdateSession(session.id, updatedIntervals)
  }

  const formatIntervalDuration = (startTime: Date, endTime: Date) => {
    const totalSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${secs}s`
  }

  const getSideCounts = () => {
    const left = session.intervals.filter(i => i.side === 'left').length
    const right = session.intervals.filter(i => i.side === 'right').length
    return { left, right }
  }

  const { left, right } = getSideCounts()

  return (
    <div class="sessionDetailsContainer">
      <header class="sessionDetailsHeader">
        <button class="backButton" onClick={onBack}>
          ← Back
        </button>
        <h1>Session Details</h1>
      </header>

      <div class="sessionInfo">
        <div class="sessionInfoRow">
          <span class="infoLabel">Started:</span>
          <span class="infoValue">
            {session.intervals.length > 0 
              ? session.intervals[0].startTime.toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : '-'}
          </span>
        </div>
        <div class="sessionInfoRow">
          <span class="infoLabel">Total Duration:</span>
          <span class="infoValue">{formatDuration(session.intervals)}</span>
        </div>
        <div class="sessionInfoRow">
          <span class="infoLabel">Intervals:</span>
          <span class="infoValue">Left: {left} | Right: {right}</span>
        </div>
      </div>

      <div class="sideTotals">
        <div class="sideTotal">
          <h3>Left</h3>
          <div class="totalTime">{formatTimer(getTotalTimeForSide('left'))}</div>
        </div>
        <div class="sideTotal">
          <h3>Right</h3>
          <div class="totalTime">{formatTimer(getTotalTimeForSide('right'))}</div>
        </div>
      </div>

      <div class="intervalHistory">
        <h3>Session History</h3>
        {session.intervals.length === 0 ? (
          <p class="emptyHistory">No intervals recorded</p>
        ) : (
          <div class="intervalsList">
            {session.intervals.map((interval, idx) => (
              <div key={idx} class="intervalItem">
                <span class={`intervalSide ${interval.side}`}>
                  {interval.side === 'left' ? 'L' : 'R'}
                </span>
                <span>{interval.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                {interval.endTime && (
                  <>
                    <span class="intervalDuration">
                      {formatIntervalDuration(interval.startTime, interval.endTime)}
                    </span>
                    <button 
                      class="deleteIntervalButton"
                      onClick={() => deleteInterval(idx)}
                      title="Delete interval"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

