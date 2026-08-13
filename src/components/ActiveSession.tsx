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
import { Square, ChevronLeft } from 'lucide-preact'
import { useNavigate } from '@tanstack/react-router'
import { translations } from '../i18n'

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
  const navigate = useNavigate()
  const t = translations.value.activeSession
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
    <div class="max-w-lg mx-auto px-4 pt-4 pb-6 flex flex-col gap-5">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-surface-700 dark:hover:text-surface-200 transition-colors p-0"
          onClick={() => navigate({ to: '/' })}
        >
          <ChevronLeft size={18} />
          {t.home}
        </button>
        <div class="text-sm font-medium text-surface-500 dark:text-surface-400">
          {intervals.length > 0 ? t.started({ time: intervals[0].startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }) : t.ready}
        </div>
      </div>

      {/* Total duration badge */}
      <div class="text-center">
        <div class="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">{t.total}</div>
        <div class="text-lg font-bold text-surface-800 dark:text-surface-100">{formatDurationMin(intervals)}</div>
      </div>

      {/* Side timers */}
      <div class="grid grid-cols-2 gap-3">
        {/* Left */}
        <button
          class={`rounded-2xl p-5 text-center border-2 transition-all duration-200 cursor-pointer ${
            activeLeft
              ? 'bg-side-left-50 dark:bg-side-left-500/15 border-side-left-500 shadow-lg shadow-side-left-500/20'
              : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-side-left-500/50'
          }`}
          onClick={() => toggleSide('left')}
        >
          <div class={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            activeLeft ? 'text-side-left-600 dark:text-side-left-500' : 'text-surface-500'
          }`}>{t.left}</div>
          <div class={`text-4xl sm:text-5xl font-bold font-mono mb-3 ${
            activeLeft ? 'text-side-left-600 dark:text-side-left-500' : 'text-surface-700 dark:text-surface-300'
          }`}>
            {formatTimer(getTotalTimeForSide('left'))}
          </div>
          <div class={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
            activeLeft
              ? 'bg-side-left-500 text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
          }`}>
            {activeLeft ? (
              <>
                <span class="w-2 h-2 rounded-full bg-white animate-pulse" />
                {t.tapToStop}
              </>
            ) : t.tapToStart}
          </div>
        </button>

        {/* Right */}
        <button
          class={`rounded-2xl p-5 text-center border-2 transition-all duration-200 cursor-pointer ${
            activeRight
              ? 'bg-side-right-50 dark:bg-side-right-500/15 border-side-right-500 shadow-lg shadow-side-right-500/20'
              : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-side-right-500/50'
          }`}
          onClick={() => toggleSide('right')}
        >
          <div class={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            activeRight ? 'text-side-right-600 dark:text-side-right-500' : 'text-surface-500'
          }`}>{t.right}</div>
          <div class={`text-4xl sm:text-5xl font-bold font-mono mb-3 ${
            activeRight ? 'text-side-right-600 dark:text-side-right-500' : 'text-surface-700 dark:text-surface-300'
          }`}>
            {formatTimer(getTotalTimeForSide('right'))}
          </div>
          <div class={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
            activeRight
              ? 'bg-side-right-500 text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
          }`}>
            {activeRight ? (
              <>
                <span class="w-2 h-2 rounded-full bg-white animate-pulse" />
                {t.tapToStop}
              </>
            ) : t.tapToStart}
          </div>
        </button>
      </div>

      {/* End session */}
      <button
        class="w-full bg-danger-500 hover:bg-danger-600 text-white border-none py-3.5 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        onClick={onEndSession}
      >
        <Square size={16} fill="currentColor" />
        {t.endSession}
      </button>

      {/* Interval history */}
      {intervals.length > 0 && (
        <div>
          <h3 class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider m-0 mb-3">{t.intervals}</h3>
          <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
            <div class="flex flex-col divide-y divide-surface-100 dark:divide-surface-700">
              {intervals.map((interval, idx) => (
                <IntervalRow
                  key={idx}
                  interval={interval}
                  onDelete={interval.endTime ? () => deleteInterval(idx) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
