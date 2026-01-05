import { useState } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { IntervalModal } from './IntervalModal'
import './SessionDetails.css'

type Props = {
  session: Session
  onBack: () => void
  onUpdateSession: (sessionId: string, intervals: Interval[]) => void
  onDeleteSession: (sessionId: string) => void
}

export function SessionDetails({ session, onBack, onUpdateSession, onDeleteSession }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
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

  const handleSaveInterval = (interval: Interval) => {
    if (editingIndex !== null) {
      const updatedIntervals = session.intervals.map((int, idx) =>
        idx === editingIndex ? interval : int
      )
      onUpdateSession(session.id, updatedIntervals)
      setEditingIndex(null)
    } else {
      const updatedIntervals = [...session.intervals, interval].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      )
      onUpdateSession(session.id, updatedIntervals)
      setShowAddModal(false)
    }
  }

  const handleDeleteFromModal = () => {
    if (editingIndex !== null) {
      deleteInterval(editingIndex)
      setEditingIndex(null)
    }
  }

  const handleDeleteSession = () => {
    if (confirm('Are you sure you want to delete this entire session? This cannot be undone.')) {
      onDeleteSession(session.id)
    }
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
        <button class="deleteSessionButton" onClick={handleDeleteSession}>
          Delete Session
        </button>
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
        <div class="historyHeader">
          <h3>Session History</h3>
          <button class="addIntervalButton" onClick={() => setShowAddModal(true)}>
            + Add Interval
          </button>
        </div>
        {session.intervals.length === 0 ? (
          <p class="emptyHistory">No intervals recorded</p>
        ) : (
          <div class="intervalsList">
            {session.intervals.map((interval, idx) => (
              <div
                key={idx}
                class="intervalItem clickable"
                onClick={() => interval.endTime && setEditingIndex(idx)}
              >
                <span class={`intervalSide ${interval.side}`}>
                  {interval.side === 'left' ? 'L' : 'R'}
                </span>
                <span>{interval.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                {interval.endTime && (
                  <span class="intervalDuration">
                    {formatIntervalDuration(interval.startTime, interval.endTime)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(editingIndex !== null || showAddModal) && (
        <IntervalModal
          interval={editingIndex !== null ? session.intervals[editingIndex] : undefined}
          onClose={() => {
            setEditingIndex(null)
            setShowAddModal(false)
          }}
          onSave={handleSaveInterval}
          onDelete={editingIndex !== null ? handleDeleteFromModal : undefined}
        />
      )}
    </div>
  )
}

