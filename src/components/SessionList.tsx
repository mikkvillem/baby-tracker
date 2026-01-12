import { useState } from 'preact/hooks'
import type { Session } from '../app'
import { ManualSessionModal } from './ManualSessionModal'
import { NextFeedingCard } from './NextFeedingCard'
import { DailyStats } from './DailyStats'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  sessions: Session[]
  onStartNewSession: () => void
  onAddManualSession: (session: Session) => void
}

export function SessionList({ sessions, onStartNewSession, onAddManualSession }: Props) {
  const navigate = useNavigate()
  const [showManualModal, setShowManualModal] = useState(false)
  const handleManualSave = (session: Session) => {
    onAddManualSession(session)
    setShowManualModal(false)
  }

  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-5">
      <header class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold m-0 mb-4">Baby Tracker</h1>

        <NextFeedingCard sessions={sessions} />
        <DailyStats sessions={sessions} />
      </header>

      <nav class="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <button
          class="bg-emerald-500 text-white border-none p-6 sm:p-8 rounded-2xl font-semibold text-base sm:text-lg cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98] shadow-md flex flex-col items-center gap-2"
          onClick={onStartNewSession}
        >
          <span class="text-3xl sm:text-4xl">▶️</span>
          <span>Live Track</span>
        </button>

        <button
          class="bg-blue-500 text-white border-none p-6 sm:p-8 rounded-2xl font-semibold text-base sm:text-lg cursor-pointer transition-all duration-200 hover:bg-blue-600 active:scale-[0.98] shadow-md flex flex-col items-center gap-2"
          onClick={() => setShowManualModal(true)}
        >
          <span class="text-3xl sm:text-4xl">✏️</span>
          <span>Manual Add</span>
        </button>

        <button
          class="bg-amber-500 text-white border-none p-6 sm:p-8 rounded-2xl font-semibold text-base sm:text-lg cursor-pointer transition-all duration-200 hover:bg-amber-600 active:scale-[0.98] shadow-md flex flex-col items-center gap-2"
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          <span class="text-3xl sm:text-4xl">🚼</span>
          <span>Diaper Track</span>
        </button>

        <button
          class="bg-purple-500 text-white border-none p-6 sm:p-8 rounded-2xl font-semibold text-base sm:text-lg cursor-pointer transition-all duration-200 hover:bg-purple-600 active:scale-[0.98] shadow-md flex flex-col items-center gap-2"
          onClick={() => navigate({ to: '/history' })}
        >
          <span class="text-3xl sm:text-4xl">📋</span>
          <span>History</span>
        </button>
      </nav>

      {showManualModal && (
        <ManualSessionModal
          onClose={() => setShowManualModal(false)}
          onSave={handleManualSave}
        />
      )}
    </div>
  )
}

