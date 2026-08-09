import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'preact/hooks'
import { feedingSettings, updateSettings, DEFAULT_MEDICINE_OPTIONS } from '../store/settings'
import { useNotificationPermission } from '../hooks/useNotificationPermission'
import { Switch } from '../components/Switch'
import { AlarmClock, Timer, Pill, Bell, X, Plus } from 'lucide-preact'

export const Route = createFileRoute('/settings')({
  component: SettingsRoute
})

const PRESET_HOURS = [2, 2.5, 3, 3.5, 4]
const SIGNIFICANT_INTERVAL_PRESETS = [5, 10, 15, 20]

const inputClass = 'w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all'

const pillClass = (isActive: boolean) =>
  `px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border ${
    isActive
      ? 'bg-primary-500 border-primary-500 text-white'
      : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
  }`

function SettingsRoute() {
  const intervalMinutes = feedingSettings.value.intervalMinutes
  const hours = Math.floor(intervalMinutes / 60)
  const minutes = intervalMinutes % 60

  const setIntervalMinutes = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
      updateSettings({ intervalMinutes: Math.round(value) })
    }
  }

  const significantIntervalMinutes = feedingSettings.value.significantIntervalMinutes

  const setSignificantIntervalMinutes = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
      updateSettings({ significantIntervalMinutes: Math.round(value) })
    }
  }

  const { supported: notificationsSupported, unsupportedReason, permission, requestPermission } = useNotificationPermission()
  const notificationsEnabled = feedingSettings.value.notificationsEnabled
  const notificationTiming = feedingSettings.value.notificationTiming
  const notificationLeadMinutes = feedingSettings.value.notificationLeadMinutes
  const notificationOverdueMinutes = feedingSettings.value.notificationOverdueMinutes
  const notificationsBlocked = notificationsSupported && permission === 'denied'

  const setNotificationLeadMinutes = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
      updateSettings({ notificationLeadMinutes: Math.round(value) })
    }
  }

  const setNotificationOverdueMinutes = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
      updateSettings({ notificationOverdueMinutes: Math.round(value) })
    }
  }

  const handleToggleNotifications = async (checked: boolean) => {
    if (!checked) {
      updateSettings({ notificationsEnabled: false })
      return
    }
    const result = permission === 'granted' ? 'granted' : await requestPermission()
    updateSettings({ notificationsEnabled: result === 'granted' })
  }

  const medicineOptions = feedingSettings.value.medicineOptions
  const [newMedicine, setNewMedicine] = useState('')

  const addMedicine = () => {
    const trimmed = newMedicine.trim()
    if (!trimmed || medicineOptions.includes(trimmed)) return
    updateSettings({ medicineOptions: [...medicineOptions, trimmed] })
    setNewMedicine('')
  }

  const removeMedicine = (name: string) => {
    updateSettings({ medicineOptions: medicineOptions.filter(m => m !== name) })
  }

  const resetMedicineOptions = () => {
    updateSettings({ medicineOptions: DEFAULT_MEDICINE_OPTIONS })
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
              class={inputClass}
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
              class={inputClass}
            />
          </div>
        </div>

        <p class="m-0 text-xs text-surface-400">
          Suggests a feeding roughly every {hours > 0 ? `${hours}h ` : ''}{minutes > 0 || hours === 0 ? `${minutes}m` : ''} after the last one ends.
        </p>
      </div>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
            <Timer size={16} class="text-primary-500" />
          </div>
          <div>
            <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">Significant Interval</h2>
            <p class="m-0 text-xs text-surface-500">Minimum duration for a nursing interval to count as a real feed</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          {SIGNIFICANT_INTERVAL_PRESETS.map(m => {
            const isActive = m === significantIntervalMinutes
            return (
              <button
                key={m}
                type="button"
                class={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
                onClick={() => setSignificantIntervalMinutes(m)}
              >
                {m}m
              </button>
            )
          })}
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5 text-surface-500">Minutes</label>
          <input
            type="number"
            min="1"
            step="1"
            value={significantIntervalMinutes}
            onInput={(e) => setSignificantIntervalMinutes(parseInt((e.target as HTMLInputElement).value || '0'))}
            class={inputClass}
          />
        </div>

        <p class="m-0 text-xs text-surface-400">
          Side switches shorter than {significantIntervalMinutes}m are treated as noise and ignored when finding the last feeding time.
        </p>
      </div>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2.5">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
              <Bell size={16} class="text-primary-500" />
            </div>
            <div>
              <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">Feeding Notifications</h2>
              <p class="m-0 text-xs text-surface-500">Get notified about the next feeding on this device</p>
            </div>
          </div>
          <Switch
            checked={notificationsEnabled && permission === 'granted'}
            disabled={!notificationsSupported || notificationsBlocked}
            onChange={handleToggleNotifications}
            ariaLabel="Enable feeding notifications"
          />
        </div>

        {!notificationsSupported && (
          <p class="m-0 text-xs text-surface-400">
            {unsupportedReason ?? 'Notifications are not supported on this device.'}
          </p>
        )}

        {notificationsBlocked && (
          <p class="m-0 text-xs text-danger-500">
            Notifications are blocked for this app. Enable them in your browser or device settings to turn this on.
          </p>
        )}

        {notificationsSupported && !notificationsBlocked && notificationsEnabled && (
          <>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class={pillClass(notificationTiming === 'before')}
                onClick={() => updateSettings({ notificationTiming: 'before' })}
              >
                Before feeding
              </button>
              <button
                type="button"
                class={pillClass(notificationTiming === 'overdue')}
                onClick={() => updateSettings({ notificationTiming: 'overdue' })}
              >
                When overdue
              </button>
            </div>

            {notificationTiming === 'before' ? (
              <div>
                <label class="block text-xs font-medium mb-1.5 text-surface-500">Minutes before</label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={notificationLeadMinutes}
                  onInput={(e) => setNotificationLeadMinutes(parseInt((e.target as HTMLInputElement).value || '0'))}
                  class={inputClass}
                />
                <p class="m-0 mt-1.5 text-xs text-surface-400">
                  Notify {notificationLeadMinutes}m before the suggested feeding time.
                </p>
              </div>
            ) : (
              <div>
                <label class="block text-xs font-medium mb-1.5 text-surface-500">Minutes overdue</label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={notificationOverdueMinutes}
                  onInput={(e) => setNotificationOverdueMinutes(parseInt((e.target as HTMLInputElement).value || '0'))}
                  class={inputClass}
                />
                <p class="m-0 mt-1.5 text-xs text-surface-400">
                  Notify {notificationOverdueMinutes}m after the suggested feeding time has passed.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2.5">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
              <Pill size={16} class="text-primary-500" />
            </div>
            <div>
              <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">Medicine List</h2>
              <p class="m-0 text-xs text-surface-500">Options shown when logging a medicine event</p>
            </div>
          </div>
          <button
            type="button"
            class="text-xs font-medium text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 bg-transparent border-none cursor-pointer p-0 shrink-0"
            onClick={resetMedicineOptions}
          >
            Reset
          </button>
        </div>

        {medicineOptions.length > 0 && (
          <div class="flex flex-wrap gap-2">
            {medicineOptions.map(name => (
              <span
                key={name}
                class="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200"
              >
                {name}
                <button
                  type="button"
                  class="w-4 h-4 flex items-center justify-center bg-transparent border-none text-surface-400 hover:text-danger-500 cursor-pointer p-0 rounded-full transition-colors"
                  onClick={() => removeMedicine(name)}
                  aria-label={`Remove ${name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div class="flex gap-2">
          <input
            type="text"
            value={newMedicine}
            onInput={(e) => setNewMedicine((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addMedicine()
              }
            }}
            placeholder="e.g. Teething gel"
            class={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            class="px-3.5 rounded-xl border-none bg-primary-500 text-white cursor-pointer transition-all duration-200 hover:bg-primary-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={addMedicine}
            disabled={!newMedicine.trim()}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
