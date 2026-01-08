import { feedingSettings, updateSettings, type PredictorMethod } from '../store/settings'

type Props = {
  onClose: () => void
}

export function FeedingSettingsModal({ onClose }: Props) {
  const settings = feedingSettings.value

  const handleMethodChange = (method: PredictorMethod) => {
    updateSettings({ predictorMethod: method })
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div class="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 class="m-0 mb-5 text-xl font-semibold">Feeding Prediction Settings</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Prediction Method</label>
          <select
            value={settings.predictorMethod}
            onChange={(e) => handleMethodChange((e.target as HTMLSelectElement).value as PredictorMethod)}
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          >
            <option value="simple">Simple Interval</option>
            <option value="distribution">Daily Distribution (Recommended)</option>
            <option value="adaptive">Adaptive Pattern</option>
          </select>
          <p class="mt-1 mb-0 text-xs text-gray-500">
            {settings.predictorMethod === 'simple' && 
              'Fixed time between feedings'}
            {settings.predictorMethod === 'distribution' && 
              'Distributes remaining feedings across waking hours'}
            {settings.predictorMethod === 'adaptive' && 
              'Learns from your feeding patterns (requires 5+ sessions)'}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Target Daily Sessions</label>
          <input
            type="number"
            min="6"
            max="15"
            value={settings.targetDailySessions}
            onInput={(e) => 
              updateSettings({ targetDailySessions: parseInt((e.target as HTMLInputElement).value) })
            }
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          />
          <p class="mt-1 mb-0 text-xs text-gray-500">Recommended: 8-12 sessions per day</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Simple Interval (minutes)</label>
          <input
            type="number"
            min="60"
            max="300"
            step="15"
            value={settings.simpleIntervalMinutes}
            onInput={(e) => 
              updateSettings({ simpleIntervalMinutes: parseInt((e.target as HTMLInputElement).value) })
            }
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          />
          <p class="mt-1 mb-0 text-xs text-gray-500">Used for simple mode or as fallback</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Waking Hours</label>
          <div class="flex gap-3 items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={settings.wakingStartHour}
              onInput={(e) => 
                updateSettings({ wakingStartHour: parseInt((e.target as HTMLInputElement).value) })
              }
              class="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
            <span class="text-sm">to</span>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.wakingEndHour}
              onInput={(e) => 
                updateSettings({ wakingEndHour: parseInt((e.target as HTMLInputElement).value) })
              }
              class="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>
          <p class="mt-1 mb-0 text-xs text-gray-500">
            {settings.wakingStartHour}:00 - {settings.wakingEndHour}:00
          </p>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <button 
            type="button" 
            class="px-4 sm:px-5 py-2.5 border-none bg-blue-500 text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

