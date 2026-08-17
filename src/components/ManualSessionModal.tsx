import { useState } from 'preact/hooks'
import type { Session, Interval } from '../app'
import { Modal } from './Modal'
import { SideSelector } from './SideSelector'
import { translations } from '../i18n'

const inputClass = 'w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all'

type Props = {
  onClose: () => void
  onSave: (session: Session) => void
}

export function ManualSessionModal({ onClose, onSave }: Props) {
  const t = translations.value.manualSessionModal
  const common = translations.value.common
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
      alert(t.errorEndBeforeStart)
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
    <Modal title={t.title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <SideSelector value={side} onChange={setSide} />
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.date}</label>
          <input type="date" value={date} onInput={(e) => setDate((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.startTime}</label>
          <input type="time" value={startTime} onInput={(e) => handleStartTimeChange((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.durationMinutes}</label>
          <input type="number" value={durationMinutes} onInput={(e) => handleDurationChange(parseInt((e.target as HTMLInputElement).value) || 0)} min="0" step="1" class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.endTime}</label>
          <input type="time" value={endTime} onInput={(e) => handleEndTimeChange((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" class="px-4 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-surface-50 dark:hover:bg-surface-700" onClick={onClose}>{common.cancel}</button>
          <button type="submit" class="px-4 py-2.5 border-none bg-primary-500 text-white rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-600">{common.create}</button>
        </div>
      </form>
    </Modal>
  )
}
