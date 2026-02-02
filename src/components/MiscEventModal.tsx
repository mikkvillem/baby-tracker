import { useState } from 'preact/hooks'
import type { MiscEvent, MiscEventType } from '../app'

type Props = {
  onClose: () => void
  onSave: (event: MiscEvent) => void
}

const EVENT_OPTIONS: { type: MiscEventType; label: string; emoji: string; color: string }[] = [
  { type: 'diaper', label: 'Diaper', emoji: '🚼', color: 'bg-amber-500 hover:bg-amber-600' },
  { type: 'vitamin', label: 'Vitamin D', emoji: '💊', color: 'bg-orange-500 hover:bg-orange-600' },
  { type: 'probiotic', label: 'Probiotic', emoji: '🦠', color: 'bg-green-500 hover:bg-green-600' },
  { type: 'custom', label: 'Custom', emoji: '✏️', color: 'bg-gray-500 hover:bg-gray-600' }
]

export function MiscEventModal({ onClose, onSave }: Props) {
  const [selectedType, setSelectedType] = useState<MiscEventType | null>(null)
  const [customLabel, setCustomLabel] = useState('')
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

    const timestamp = new Date(`${date}T${time}`)

    const newEvent: MiscEvent = {
      id: Date.now().toString(),
      type: selectedType,
      customLabel: selectedType === 'custom' ? customLabel : undefined,
      timestamp,
      notes: notes.trim() || undefined
    }

    onSave(newEvent)
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div class="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 class="m-0 mb-5 text-xl font-semibold">Add Event</h2>

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
                  onClick={() => setSelectedType(option.type)}
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
      </div>
    </div>
  )
}
