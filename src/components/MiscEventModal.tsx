import { useState } from 'preact/hooks'
import type { MiscEvent, MiscEventType, MeasurementKind } from '../app'
import { Modal } from './Modal'

type Props = {
  onClose: () => void
  onSave: (event: MiscEvent) => void
}

const EVENT_OPTIONS: { type: MiscEventType; label: string; emoji: string; color: string }[] = [
  { type: 'diaper', label: 'Diaper', emoji: '🚼', color: 'bg-amber-500 hover:bg-amber-600' },
  { type: 'medicine', label: 'Medicine', emoji: '💊', color: 'bg-orange-500 hover:bg-orange-600' },
  { type: 'measurement', label: 'Measurement', emoji: '📏', color: 'bg-green-500 hover:bg-green-600' },
  { type: 'custom', label: 'Custom', emoji: '✏️', color: 'bg-gray-500 hover:bg-gray-600' }
]

const MEDICINE_OPTIONS = [
  'Vitamin D',
  'Probiotic',
  'Paracetamol',
  'Ibuprofen',
  'Gripe water',
  'Gas drops',
  'Iron supplement',
  'Other'
]

const MEASUREMENT_TABS: { kind: MeasurementKind; label: string }[] = [
  { kind: 'weight', label: 'Weight' },
  { kind: 'height', label: 'Height' },
  { kind: 'headCircumference', label: 'Head' }
]

const DEFAULT_UNITS: Record<MeasurementKind, string> = {
  weight: 'kg',
  height: 'cm',
  headCircumference: 'cm'
}

export function MiscEventModal({ onClose, onSave }: Props) {
  const [selectedType, setSelectedType] = useState<MiscEventType | null>(null)
  const [customLabel, setCustomLabel] = useState('')
  const [medicineName, setMedicineName] = useState('')
  const [measurementTab, setMeasurementTab] = useState<MeasurementKind>('weight')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurementUnit, setMeasurementUnit] = useState('kg')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))

  const handleSubmit = (e: Event) => {
    e.preventDefault()

    if (!selectedType) {
      alert('Please select an event type')
      return
    }

    if (selectedType === 'custom' && !customLabel.trim()) {
      alert('Please enter a label for custom event')
      return
    }

    if (selectedType === 'medicine' && !medicineName) {
      alert('Please select a medicine')
      return
    }

    if (selectedType === 'measurement') {
      const value = parseFloat(measurementValue)
      if (Number.isNaN(value) || value <= 0) {
        alert('Please enter a valid measurement value')
        return
      }
    }

    const timestamp = new Date(`${date}T${time}`)

    const newEvent: MiscEvent = {
      id: Date.now().toString(),
      type: selectedType,
      customLabel: selectedType === 'custom' ? customLabel : undefined,
      medicineName: selectedType === 'medicine' ? medicineName : undefined,
      measurementKind: selectedType === 'measurement' ? measurementTab : undefined,
      measurementValue: selectedType === 'measurement' ? parseFloat(measurementValue) : undefined,
      measurementUnit: selectedType === 'measurement' ? measurementUnit : undefined,
      timestamp,
      notes: notes.trim() || undefined
    }

    onSave(newEvent)
  }

  const handleTypeSelect = (type: MiscEventType) => {
    setSelectedType(type)
    if (type === 'measurement') {
      setMeasurementUnit(DEFAULT_UNITS[measurementTab])
    }
  }

  const handleMeasurementTabChange = (kind: MeasurementKind) => {
    setMeasurementTab(kind)
    setMeasurementUnit(DEFAULT_UNITS[kind])
    setMeasurementValue('')
  }

  return (
    <Modal title="Add Event" onClose={onClose}>
      <form onSubmit={handleSubmit}>
          <div class="mb-5">
            <label class="block text-sm font-medium mb-3 text-gray-700">Event Type</label>
            <div class="grid grid-cols-2 gap-3">
              {EVENT_OPTIONS.map(option => (
                <button
                  key={option.type}
                  type="button"
                  class={`p-4 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98] flex flex-col items-center gap-2 ${selectedType === option.type
                    ? option.color + ' ring-4 ring-offset-2 ring-blue-300'
                    : option.color
                  }`}
                  onClick={() => handleTypeSelect(option.type)}
                >
                  <span class="text-3xl">{option.emoji}</span>
                  <span class="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedType === 'custom' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5 text-gray-700">Custom Label</label>
              <input
                type="text"
                value={customLabel}
                onInput={(e) => setCustomLabel((e.target as HTMLInputElement).value)}
                placeholder="e.g., Bath time, Tummy time"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              />
            </div>
          )}

          {selectedType === 'medicine' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5 text-gray-700">Medicine</label>
              <select
                value={medicineName}
                onInput={(e) => setMedicineName((e.target as HTMLSelectElement).value)}
                required
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              >
                <option value="">Select...</option>
                {MEDICINE_OPTIONS.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedType === 'measurement' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2 text-gray-700">Measurement</label>
              <div class="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
                {MEASUREMENT_TABS.map(({ kind, label }) => (
                  <button
                    key={kind}
                    type="button"
                    class={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${measurementTab === kind
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleMeasurementTabChange(kind)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div class="flex gap-2 items-center">
                <input
                  type="number"
                  step={measurementTab === 'weight' ? 0.01 : 0.1}
                  min="0"
                  value={measurementValue}
                  onInput={(e) => setMeasurementValue((e.target as HTMLInputElement).value)}
                  placeholder={measurementTab === 'weight' ? 'e.g. 4.2' : 'e.g. 55'}
                  class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                />
                <input
                  type="text"
                  value={measurementUnit}
                  onInput={(e) => setMeasurementUnit((e.target as HTMLInputElement).value)}
                  placeholder="Unit"
                  class="w-16 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onInput={(e) => setDate((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onInput={(e) => setTime((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
              placeholder="Add any additional notes..."
              rows={2}
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] resize-none"
            />
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button
              type="button"
              class="px-4 sm:px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 sm:px-5 py-2.5 border-none bg-blue-500 text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600"
            >
              Add Event
            </button>
          </div>
        </form>
    </Modal>
  )
}
