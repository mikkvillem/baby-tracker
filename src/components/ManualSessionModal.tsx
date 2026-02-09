import { useState } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { Modal } from './Modal'
import { SideSelector } from './SideSelector'

const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
const buttonSecondaryClass = 'px-4 sm:px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50'
const buttonPrimaryClass = 'px-4 sm:px-5 py-2.5 border-none bg-blue-500 text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600'

type Props = {
  onClose: () => void
  onSave: (session: Session) => void
}

export function ManualSessionModal({ onClose, onSave }: Props) {
  const now = new Date()
  const [date, setDate] = useState(now.toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState(now.toTimeString().slice(0, 5))
  const [endTime, setEndTime] = useState(now.toTimeString().slice(0, 5))
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [side, setSide] = useState<'left' | 'right'>('left')

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime)
    // Set end time to same as start time
    setEndTime(newStartTime)
    setDurationMinutes(0)
  }

  const handleDurationChange = (minutes: number) => {
    setDurationMinutes(minutes)
    // Update end time based on start time + duration
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(start.getTime() + minutes * 60000)
    const endTimeStr = end.toTimeString().slice(0, 5)
    setEndTime(endTimeStr)
  }

  const handleEndTimeChange = (newEndTime: string) => {
    setEndTime(newEndTime)
    // Calculate duration
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${newEndTime}`)
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
    setDurationMinutes(diffMinutes >= 0 ? diffMinutes : 0)
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    
    if (end <= start) {
      alert('End time must be after start time')
      return
    }

    const interval: Interval = {
      side,
      startTime: start,
      endTime: end
    }

    const newSession: Session = {
      id: Date.now().toString(),
      startTime: start,
      intervals: [interval],
      isActive: false
    }
    onSave(newSession)
  }

  return (
    <Modal title="New Manual Session" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <SideSelector value={side} onChange={setSide} />
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Date</label>
          <input type="date" value={date} onInput={(e) => setDate((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Start Time</label>
          <input type="time" value={startTime} onInput={(e) => handleStartTimeChange((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">Duration (minutes)</label>
          <input type="number" value={durationMinutes} onInput={(e) => handleDurationChange(parseInt((e.target as HTMLInputElement).value) || 0)} min="0" step="1" class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-gray-700">End Time</label>
          <input type="time" value={endTime} onInput={(e) => handleEndTimeChange((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class={buttonSecondaryClass} onClick={onClose}>Cancel</button>
          <button type="submit" class={buttonPrimaryClass}>Create Session</button>
        </div>
      </form>
    </Modal>
  )
}

