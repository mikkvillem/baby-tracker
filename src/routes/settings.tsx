import { createFileRoute } from '@tanstack/react-router'
import { feedingSettings, updateSettings } from '../store/settings'
import { AlarmClock } from 'lucide-preact'

export const Route = createFileRoute('/settings')({
  component: SettingsRoute
})

const PRESET_HOURS = [2, 2.5, 3, 3.5, 4]

function SettingsRoute() {
  const intervalMinutes = feedingSettings.value.intervalMinutes
  const hours = Math.floor(intervalMinutes / 60)
  const minutes = intervalMinutes % 60

  const setIntervalMinutes = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
      updateSettings({ intervalMinutes: Math.round(value) })
    }
  }

  return (
    <div class="max-w-lg mx-auto px-4 pt-4 pb-6 flex flex-col gap-4">
      <h1 class="m-0 text-xl font-semibold text-surface-800 dark:text-surface-100">Settings</h1>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
            <AlarmClock size={16} class="text-primary-500" />
          </div>
          <div>
            <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">Feeding Reminder</h2>
            <p class="m-0 text-xs text-surface-500">Used to suggest the next feeding time on the home screen</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          {PRESET_HOURS.map(h => {
            const presetMinutes = h * 60
            const isActive = presetMinutes === intervalMinutes
            return (
              <button
                key={h}
                type="button"
                class={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
                onClick={() => setIntervalMinutes(presetMinutes)}
              >
                {h % 1 === 0 ? `${h}h` : `${Math.floor(h)}h 30m`}
              </button>
            )
          })}
        </div>

        <div class="flex items-center gap-3">
          <div class="flex-1">
            <label class="block text-xs font-medium mb-1.5 text-surface-500">Hours</label>
            <input
              type="number"
              min="0"
              step="1"
              value={hours}
              onInput={(e) => setIntervalMinutes(parseInt((e.target as HTMLInputElement).value || '0') * 60 + minutes)}
              class="w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
            />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-medium mb-1.5 text-surface-500">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              step="5"
              value={minutes}
              onInput={(e) => setIntervalMinutes(hours * 60 + (parseInt((e.target as HTMLInputElement).value || '0')))}
              class="w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
            />
          </div>
        </div>

        <p class="m-0 text-xs text-surface-400">
          Suggests a feeding roughly every {hours > 0 ? `${hours}h ` : ''}{minutes > 0 || hours === 0 ? `${minutes}m` : ''} after the last one ends.
        </p>
      </div>
    </div>
  )
}
