import { useState } from 'preact/hooks'
import type { Session } from '../app'

type Props = {
  onClose: () => void
  onSave: (session: Session) => void
}

export function ManualSessionModal({ onClose, onSave }: Props) {
  const now = new Date()
  const [date, setDate] = useState(now.toISOString().slice(0, 10))
  const [time, setTime] = useState(now.toTimeString().slice(0, 5))

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const sessionDate = new Date(`${date}T${time}`)
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: sessionDate,
      intervals: [],
      isActive: false
    }
    onSave(newSession)
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div class="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 class="m-0 mb-5 text-xl font-semibold">New Manual Session</h2>
        <form onSubmit={handleSubmit}>
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
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

