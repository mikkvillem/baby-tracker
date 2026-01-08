import { useState, useEffect } from 'preact/hooks'
import { computed } from '@preact/signals'
import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'

type Props = {
  sessions: Session[]
  onOpenSettings: () => void
}

export function NextFeedingCard({ sessions, onOpenSettings }: Props) {
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
    <div class={`rounded-2xl p-4 sm:p-5 mb-6 text-white shadow-md ${
      isOverdue 
        ? 'bg-gradient-to-br from-pink-400 to-rose-500' 
        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }`}>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⏰</span>
        <h3 class="m-0 text-base font-semibold flex-1">Next Feeding</h3>
        <button 
          class="bg-white/20 border-none w-8 h-8 rounded-lg text-base cursor-pointer transition-all duration-200 hover:bg-white/30 hover:scale-105 flex items-center justify-center"
          onClick={onOpenSettings}
        >
          ⚙️
        </button>
      </div>
      <div class="text-center">
        <p class="text-4xl sm:text-5xl font-bold my-2 font-mono">
          {pred.suggestedTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p class="text-lg font-medium my-1 opacity-90">{formatTimeUntil(pred.suggestedTime)}</p>
        <p class="text-sm opacity-80 mt-2 mb-0">{pred.reasoning}</p>
      </div>
    </div>
  )
}

