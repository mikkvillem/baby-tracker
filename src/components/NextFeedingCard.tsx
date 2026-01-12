import { useState, useEffect } from 'preact/hooks'
import { computed } from '@preact/signals'
import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'

type Props = {
  sessions: Session[]
}

export function NextFeedingCard({ sessions }: Props) {
  const [, forceUpdate] = useState(0)
  
  const prediction = computed(() => 
    suggestNextFeeding(sessions, feedingSettings.value)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate(prev => prev + 1)
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const pred = prediction.value
  
  if (!pred.suggestedTime) return null

  const isOverdue = pred.suggestedTime.getTime() < Date.now()

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
            {pred.suggestedTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm font-medium">{formatTimeUntil(pred.suggestedTime)}</div>
      </div>
    </div>
  )
}

