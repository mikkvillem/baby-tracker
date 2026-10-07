import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding, formatTimeUntil } from '../utils/feedingPredictor'
import { useCurrentTime } from '../hooks/useCurrentTime'
import { translations } from '../i18n'

type Props = {
  sessions: Session[]
}

export function NextFeedingCard({ sessions }: Props) {
  useCurrentTime(60000)
  const t = translations.value.nextFeeding
  const prediction = suggestNextFeeding(
    sessions,
    feedingSettings.value.intervalMinutes,
    feedingSettings.value.significantIntervalMinutes
  )

  if (!prediction.suggestedTime) return null

  return (
    <div class="flex items-center justify-center gap-2 text-sm text-surface-600 dark:text-surface-300">
      <span class="text-surface-500 dark:text-surface-400">{t.label}</span>
      <span class="font-semibold font-mono text-surface-700 dark:text-surface-100">
        {prediction.suggestedTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}
      </span>
      <span class="text-surface-500 dark:text-surface-400">· {formatTimeUntil(prediction.suggestedTime)}</span>
    </div>
  )
}
