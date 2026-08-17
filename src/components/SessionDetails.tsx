import { useState } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { IntervalModal } from './IntervalModal'
import {
  formatDuration,
  getTotalTimeForSide,
  formatTimer,
  getSideCounts
} from '../utils/sessionFormatters'
import { IntervalRow } from './IntervalRow'
import { ChevronLeft, Trash2, Plus } from 'lucide-preact'
import { translations } from '../i18n'

type Props = {
  session: Session
  onBack: () => void
  onUpdateSession: (sessionId: string, intervals: Interval[]) => void
  onDeleteSession: (sessionId: string) => void
}

export function SessionDetails({ session, onBack, onUpdateSession, onDeleteSession }: Props) {
  const t = translations.value.sessionDetails
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const deleteInterval = (index: number) => {
    const updatedIntervals = session.intervals.filter((_, idx) => idx !== index)
    onUpdateSession(session.id, updatedIntervals)
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
    if (confirm(t.confirmDeleteSession)) {
      onDeleteSession(session.id)
    }
  }

  const { left, right } = getSideCounts(session.intervals)

  return (
    <div class="max-w-lg mx-auto px-4 pt-4 pb-6 flex flex-col gap-5">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-surface-700 dark:hover:text-surface-200 transition-colors p-0"
          onClick={onBack}
        >
          <ChevronLeft size={18} />
          {t.back}
        </button>
        <button
          class="flex items-center gap-1.5 text-danger-500 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-danger-600 transition-colors p-0"
          onClick={handleDeleteSession}
        >
          <Trash2 size={15} />
          {t.delete}
        </button>
      </div>

      {/* Session summary */}
      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
        <div class="flex divide-x divide-surface-100 dark:divide-surface-700">
          <div class="flex-1 p-4 text-center">
            <div class="text-xs font-medium text-surface-500 mb-1">{t.started}</div>
            <div class="text-base font-semibold text-surface-800 dark:text-surface-100">
              {session.intervals.length > 0
                ? session.intervals[0].startTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
                : '-'}
            </div>
          </div>
          <div class="flex-1 p-4 text-center">
            <div class="text-xs font-medium text-surface-500 mb-1">{t.duration}</div>
            <div class="text-base font-semibold text-surface-800 dark:text-surface-100">{formatDuration(session.intervals)}</div>
          </div>
          <div class="flex-1 p-4 text-center">
            <div class="text-xs font-medium text-surface-500 mb-1">{t.intervals}</div>
            <div class="text-base font-semibold text-surface-800 dark:text-surface-100">
              <span class="text-side-left-500">{left}L</span>
              {' '}
              <span class="text-side-right-500">{right}R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side timers */}
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-side-left-50 dark:bg-side-left-500/10 border border-side-left-100 dark:border-side-left-500/20 rounded-xl p-4 text-center">
          <div class="text-xs font-semibold uppercase tracking-wider text-side-left-600 dark:text-side-left-500 mb-1">{t.left}</div>
          <div class="text-3xl sm:text-4xl font-bold font-mono text-side-left-600 dark:text-side-left-500">
            {formatTimer(getTotalTimeForSide(session.intervals, 'left'))}
          </div>
        </div>
        <div class="bg-side-right-50 dark:bg-side-right-500/10 border border-side-right-100 dark:border-side-right-500/20 rounded-xl p-4 text-center">
          <div class="text-xs font-semibold uppercase tracking-wider text-side-right-600 dark:text-side-right-500 mb-1">{t.right}</div>
          <div class="text-3xl sm:text-4xl font-bold font-mono text-side-right-600 dark:text-side-right-500">
            {formatTimer(getTotalTimeForSide(session.intervals, 'right'))}
          </div>
        </div>
      </div>

      {/* Interval list */}
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider m-0">{t.intervals}</h3>
          <button
            class="flex items-center gap-1.5 text-primary-500 dark:text-primary-300 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-primary-600 dark:hover:text-primary-200 transition-colors p-0"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            {t.add}
          </button>
        </div>
        <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
          {session.intervals.length === 0 ? (
            <p class="text-center text-surface-400 py-8 m-0 text-sm">{t.noIntervals}</p>
          ) : (
            <div class="flex flex-col divide-y divide-surface-100 dark:divide-surface-700">
              {session.intervals.map((interval, idx) => (
                <IntervalRow
                  key={idx}
                  interval={interval}
                  onEdit={interval.endTime ? () => setEditingIndex(idx) : undefined}
                />
              ))}
            </div>
          )}
        </div>
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
