import { useState } from 'preact/hooks'
import type { Interval } from '../app'

type Props = {
  interval?: Interval
  onClose: () => void
  onSave: (interval: Interval) => void
  onDelete?: () => void
}

export function IntervalModal({ interval, onClose, onSave, onDelete }: Props) {
  const isEdit = !!interval
  const now = new Date()
  
  const [side, setSide] = useState<'left' | 'right'>(interval?.side || 'left')
  const [startDate, setStartDate] = useState(
    interval?.startTime.toISOString().slice(0, 10) || now.toISOString().slice(0, 10)
  )
  const [startTime, setStartTime] = useState(
    interval?.startTime.toTimeString().slice(0, 5) || now.toTimeString().slice(0, 5)
  )
  const [endDate, setEndDate] = useState(
    interval?.endTime?.toISOString().slice(0, 10) || now.toISOString().slice(0, 10)
  )
  const [endTime, setEndTime] = useState(
    interval?.endTime?.toTimeString().slice(0, 5) || now.toTimeString().slice(0, 5)
  )

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)
    
    if (end <= start) {
      alert('End time must be after start time')
      return
    }

    const newInterval: Interval = {
      side,
      startTime: start,
      endTime: end
    }
    onSave(newInterval)
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div class="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 class="m-0 mb-5 text-xl font-semibold">{isEdit ? 'Edit Interval' : 'Add Interval'}</h2>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Side</label>
            <div class="flex gap-2">
              <button
                type="button"
                class={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  side === 'left'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSide('left')}
              >
                Left
              </button>
              <button
                type="button"
                class={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  side === 'right'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSide('right')}
              >
                Right
              </button>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onInput={(e) => setStartDate((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onInput={(e) => setStartTime((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onInput={(e) => setEndTime((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            />
          </div>

          <div class="flex mt-6 gap-3">
            {isEdit && onDelete && (
              <button 
                type="button" 
                class="px-4 sm:px-5 py-2.5 border-none bg-red-500 text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-600"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
            <div class="ml-auto flex gap-3">
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
                {isEdit ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

