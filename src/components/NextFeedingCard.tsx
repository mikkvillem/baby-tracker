import { useState, useEffect } from 'preact/hooks'
import { computed } from '@preact/signals'
import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'
import './NextFeedingCard.css'

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
    <div class={`nextFeedingCard ${isOverdue ? 'overdue' : ''}`}>
      <div class="nextFeedingHeader">
        <span class="nextFeedingIcon">⏰</span>
        <h3>Next Feeding</h3>
        <button class="settingsIconButton" onClick={onOpenSettings}>
          ⚙️
        </button>
      </div>
      <div class="nextFeedingInfo">
        <p class="suggestedTime">
          {pred.suggestedTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p class="timeUntil">{formatTimeUntil(pred.suggestedTime)}</p>
        <p class="reasoning">{pred.reasoning}</p>
      </div>
    </div>
  )
}

