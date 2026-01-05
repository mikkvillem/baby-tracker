import { feedingSettings, updateSettings, type PredictorMethod } from '../store/settings'
import './ManualSessionModal.css'

type Props = {
  onClose: () => void
}

export function FeedingSettingsModal({ onClose }: Props) {
  const settings = feedingSettings.value

  const handleMethodChange = (method: PredictorMethod) => {
    updateSettings({ predictorMethod: method })
  }

  return (
    <div class="modalOverlay" onClick={onClose}>
      <div class="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>Feeding Prediction Settings</h2>
        
        <div class="formField">
          <label>Prediction Method</label>
          <select
            value={settings.predictorMethod}
            onChange={(e) => handleMethodChange((e.target as HTMLSelectElement).value as PredictorMethod)}
          >
            <option value="simple">Simple Interval</option>
            <option value="distribution">Daily Distribution (Recommended)</option>
            <option value="adaptive">Adaptive Pattern</option>
          </select>
          <p class="fieldDescription">
            {settings.predictorMethod === 'simple' && 
              'Fixed time between feedings'}
            {settings.predictorMethod === 'distribution' && 
              'Distributes remaining feedings across waking hours'}
            {settings.predictorMethod === 'adaptive' && 
              'Learns from your feeding patterns (requires 5+ sessions)'}
          </p>
        </div>

        <div class="formField">
          <label>Target Daily Sessions</label>
          <input
            type="number"
            min="6"
            max="15"
            value={settings.targetDailySessions}
            onInput={(e) => 
              updateSettings({ targetDailySessions: parseInt((e.target as HTMLInputElement).value) })
            }
          />
          <p class="fieldDescription">Recommended: 8-12 sessions per day</p>
        </div>

        <div class="formField">
          <label>Simple Interval (minutes)</label>
          <input
            type="number"
            min="60"
            max="300"
            step="15"
            value={settings.simpleIntervalMinutes}
            onInput={(e) => 
              updateSettings({ simpleIntervalMinutes: parseInt((e.target as HTMLInputElement).value) })
            }
          />
          <p class="fieldDescription">Used for simple mode or as fallback</p>
        </div>

        <div class="formField">
          <label>Waking Hours</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.wakingStartHour}
              onInput={(e) => 
                updateSettings({ wakingStartHour: parseInt((e.target as HTMLInputElement).value) })
              }
              style={{ width: '80px' }}
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.wakingEndHour}
              onInput={(e) => 
                updateSettings({ wakingEndHour: parseInt((e.target as HTMLInputElement).value) })
              }
              style={{ width: '80px' }}
            />
          </div>
          <p class="fieldDescription">
            {settings.wakingStartHour}:00 - {settings.wakingEndHour}:00
          </p>
        </div>

        <div class="modalActions">
          <button type="button" class="saveButton" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

