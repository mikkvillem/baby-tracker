import { useState } from 'preact/hooks'
import type { Session, MiscEvent } from '../app'
import { ManualSessionModal } from './ManualSessionModal'
import { MiscEventModal } from './MiscEventModal'
import { NextFeedingCard } from './NextFeedingCard'
import { DailyStats } from './DailyStats'
import { BearScene } from './BearScene'
import { ChevronRight } from 'lucide-preact'
import { PawIcon, BookIcon, CalendarIcon } from './icons'
import { useNavigate } from '@tanstack/react-router'
import { useIntervalTick } from '../hooks/useIntervalTick'
import { formatDurationMin } from '../utils/sessionFormatters'
import { translations } from '../i18n'

type Props = {
  sessions: Session[]
  onStartNewSession: () => void
  onAddManualSession: (session: Session) => void
  onAddMiscEvent: (event: MiscEvent) => void
}

export function SessionList({ sessions, onStartNewSession, onAddManualSession, onAddMiscEvent }: Props) {
  const navigate = useNavigate()
  const t = translations.value.home
  const [showManualModal, setShowManualModal] = useState(false)
  const [showMiscEventModal, setShowMiscEventModal] = useState(false)

  const activeSession = sessions.find(s => s.isActive)
  useIntervalTick(!!activeSession, 1000)

  const handleManualSave = (session: Session) => {
    onAddManualSession(session)
    setShowManualModal(false)
  }

  const handleMiscEventSave = (event: MiscEvent) => {
    onAddMiscEvent(event)
    setShowMiscEventModal(false)
  }

  return (
    <div class="max-w-lg mx-auto px-5 pt-5 pb-6 flex flex-col gap-6">
      <BearScene sessions={sessions} hasActiveSession={!!activeSession} />

      <NextFeedingCard sessions={sessions} />

      {/* Primary action: resume the running feed, otherwise start one */}
      {activeSession ? (
        <button
          class="w-full bg-primary-500 hover:bg-primary-600 text-white border-none py-5 px-5 rounded-3xl cursor-pointer transition-all duration-200 active:scale-[0.98] flex items-center gap-4 text-left"
          onClick={() => navigate({ to: '/session/$sessionId/active', params: { sessionId: activeSession.id } })}
        >
          <span class="w-3 h-3 rounded-full bg-white/90 animate-pulse shrink-0" />
          <span class="flex-1 min-w-0">
            <span class="block text-xs font-medium opacity-80">{t.sessionInProgress}</span>
            <span class="block text-2xl font-semibold font-mono">{formatDurationMin(activeSession.intervals)}</span>
          </span>
          <ChevronRight size={22} class="opacity-70 shrink-0" />
        </button>
      ) : (
        <button
          class="w-full bg-primary-500 hover:bg-primary-600 text-white border-none py-5 rounded-3xl font-semibold text-xl cursor-pointer transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3"
          onClick={onStartNewSession}
        >
          <PawIcon size={26} />
          {t.startFeeding}
        </button>
      )}

      {/* Secondary actions: quiet, borderless */}
      <div class="grid grid-cols-2 gap-3">
        <button
          class="bg-transparent text-surface-600 dark:text-surface-300 border-none py-3.5 rounded-2xl font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-surface-200/60 dark:hover:bg-surface-800 active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => setShowManualModal(true)}
        >
          <BookIcon size={20} class="text-warning-600" />
          {t.manualEntry}
        </button>

        <button
          class="bg-transparent text-surface-600 dark:text-surface-300 border-none py-3.5 rounded-2xl font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-surface-200/60 dark:hover:bg-surface-800 active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => setShowMiscEventModal(true)}
        >
          <CalendarIcon size={20} class="text-side-left-500" />
          {t.logEvent}
        </button>
      </div>

      {/* Today's stats */}
      <div>
        <h2 class="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider m-0 mb-2 text-center">{t.today}</h2>
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
