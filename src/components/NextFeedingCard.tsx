import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'
import { useCurrentTime } from '../hooks/useCurrentTime'

type Props = {
  sessions: Session[]
}

export function NextFeedingCard({ sessions }: Props) {
  useCurrentTime(60000)
  const prediction = suggestNextFeeding(sessions, feedingSettings.value.intervalMinutes)

  if (!prediction.suggestedTime) return null

  const isOverdue = prediction.suggestedTime.getTime() < Date.now()

  return (
    <div class={`rounded-xl p-3 mb-4 text-white shadow-sm flex items-center justify-between ${
      isOverdue
        ? 'bg-gradient-to-r from-pink-400 to-rose-500'
        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
    }`}>
      <div class="flex items-center gap-2">
        <span class="text-lg">⏰</span>
        <div>
          <div class="text-xs opacity-80">Next Feeding</div>
          <div class="text-lg font-bold font-mono">
            {prediction.suggestedTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm font-medium">{formatTimeUntil(prediction.suggestedTime)}</div>
      </div>
    </div>
  )
}
