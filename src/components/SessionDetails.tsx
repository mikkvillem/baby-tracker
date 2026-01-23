import { useState } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { IntervalModal } from './IntervalModal'

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
    <div class="max-w-2xl mx-auto px-4 sm:px-5">
      <header class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
        <button 
          class="bg-white border border-gray-200 px-3 sm:px-4 py-2 rounded-lg text-base font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
          onClick={onBack}
        >
          ← Back
        </button>
        <h1 class="m-0 text-2xl sm:text-3xl font-semibold flex-1">Session Details</h1>
        <button 
          class="bg-red-500 text-white border-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-600 active:scale-[0.98]"
          onClick={handleDeleteSession}
        >
          Delete Session
        </button>
      </header>

      <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="font-medium text-gray-500">Started:</span>
          <span class="font-semibold text-gray-800">
            {session.intervals.length > 0
              ? session.intervals[0].startTime.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
              : '-'}
          </span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="font-medium text-gray-500">Total Duration:</span>
          <span class="font-semibold text-gray-800">{formatDuration(session.intervals)}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="font-medium text-gray-500">Intervals:</span>
          <span class="font-semibold text-gray-800">Left: {left} | Right: {right}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 text-center">
          <h3 class="m-0 mb-3 text-lg font-semibold text-gray-500">Left</h3>
          <div class="text-4xl sm:text-5xl font-bold font-mono text-gray-800">
            {formatTimer(getTotalTimeForSide('left'))}
          </div>
        </div>
        <div class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 text-center">
          <h3 class="m-0 mb-3 text-lg font-semibold text-gray-500">Right</h3>
          <div class="text-4xl sm:text-5xl font-bold font-mono text-gray-800">
            {formatTimer(getTotalTimeForSide('right'))}
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        <div class="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <h3 class="m-0 text-lg font-semibold">Session History</h3>
          <button 
            class="px-3 sm:px-4 py-2 border-none bg-blue-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600"
            onClick={() => setShowAddModal(true)}
          >
            + Add Interval
          </button>
        </div>
        {session.intervals.length === 0 ? (
          <p class="text-center text-gray-500 py-5 m-0">No intervals recorded</p>
        ) : (
          <div class="flex flex-col gap-2">
            {session.intervals.map((interval, idx) => (
              <div
                key={idx}
                class={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm transition-all duration-200 ${
                  interval.endTime ? 'cursor-pointer hover:bg-gray-100 hover:translate-x-1' : ''
                }`}
                onClick={() => interval.endTime && setEditingIndex(idx)}
              >
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

