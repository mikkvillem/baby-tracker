import { useState } from 'preact/hooks'
import type { Session, MiscEvent } from '../app'
import { ManualSessionModal } from './ManualSessionModal'
import { MiscEventModal } from './MiscEventModal'
import { NextFeedingCard } from './NextFeedingCard'
import { DailyStats } from './DailyStats'
import { Play, PenLine, CalendarPlus } from 'lucide-preact'

type Props = {
  sessions: Session[]
  onStartNewSession: () => void
  onAddManualSession: (session: Session) => void
  onAddMiscEvent: (event: MiscEvent) => void
}

export function SessionList({ sessions, onStartNewSession, onAddManualSession, onAddMiscEvent }: Props) {
  const [showManualModal, setShowManualModal] = useState(false)
  const [showMiscEventModal, setShowMiscEventModal] = useState(false)
  const handleManualSave = (session: Session) => {
    onAddManualSession(session)
    setShowManualModal(false)
  }

  const handleMiscEventSave = (event: MiscEvent) => {
    onAddMiscEvent(event)
    setShowMiscEventModal(false)
  }

  return (
    <div class="max-w-lg mx-auto px-4 pt-5 pb-4 flex flex-col gap-5">
      <NextFeedingCard sessions={sessions} />

      {/* Primary action */}
      <button
        class="w-full bg-primary-500 hover:bg-primary-600 text-white border-none py-4 rounded-2xl font-semibold text-lg cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-md flex items-center justify-center gap-3"
        onClick={onStartNewSession}
      >
        <Play size={22} fill="currentColor" />
        Start Feeding
      </button>

      {/* Secondary actions */}
      <div class="grid grid-cols-2 gap-3">
        <button
          class="bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700 p-4 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => setShowManualModal(true)}
        >
          <PenLine size={18} class="text-surface-500" />
          Manual Entry
        </button>

        <button
          class="bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700 p-4 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => setShowMiscEventModal(true)}
        >
          <CalendarPlus size={18} class="text-surface-500" />
          Log Event
        </button>
      </div>

      {/* Today's stats */}
      <div>
        <h2 class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider m-0 mb-3">Today</h2>
        <DailyStats sessions={sessions} />
      </div>

      {showManualModal && (
        <ManualSessionModal
          onClose={() => setShowManualModal(false)}
          onSave={handleManualSave}
        />
      )}

      {showMiscEventModal && (
        <MiscEventModal
          onClose={() => setShowMiscEventModal(false)}
          onSave={handleMiscEventSave}
        />
      )}
    </div>
  )
}
