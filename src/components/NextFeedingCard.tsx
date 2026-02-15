import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'
import { useCurrentTime } from '../hooks/useCurrentTime'
import { AlarmClock } from 'lucide-preact'

type Props = {
  sessions: Session[]
}

export function NextFeedingCard({ sessions }: Props) {
  useCurrentTime(60000)
  const prediction = suggestNextFeeding(sessions, feedingSettings.value.intervalMinutes)

  if (!prediction.suggestedTime) return null

  const isOverdue = prediction.suggestedTime.getTime() < Date.now()

  return (
    <div class={`rounded-2xl p-4 text-white flex items-center justify-between ${
      isOverdue
        ? 'bg-gradient-to-r from-danger-500 to-primary-500'
        : 'bg-gradient-to-r from-primary-400 to-side-right-500'
    }`}>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <AlarmClock size={20} />
        </div>
        <div>
          <div class="text-xs font-medium opacity-80">Next Feeding</div>
          <div class="text-xl font-bold font-mono">
            {prediction.suggestedTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
          {formatTimeUntil(prediction.suggestedTime)}
        </div>
      </div>
    </div>
  )
}
