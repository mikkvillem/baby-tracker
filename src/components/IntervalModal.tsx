import { useState } from 'preact/hooks'
import type { Interval } from '../app'
import { Modal } from './Modal'
import { SideSelector } from './SideSelector'

const inputClass = 'w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all'

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
    onSave({ side, startTime: start, endTime: end })
  }

  return (
    <Modal title={isEdit ? 'Edit Interval' : 'Add Interval'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <SideSelector value={side} onChange={setSide} />
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">Start Date</label>
          <input type="date" value={startDate} onInput={(e) => setStartDate((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">Start Time</label>
          <input type="time" value={startTime} onInput={(e) => setStartTime((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">End Date</label>
          <input type="date" value={endDate} onInput={(e) => setEndDate((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">End Time</label>
          <input type="time" value={endTime} onInput={(e) => setEndTime((e.target as HTMLInputElement).value)} required class={inputClass} />
        </div>
        <div class="flex mt-6 gap-3">
          {isEdit && onDelete && (
            <button type="button" class="px-4 py-2.5 border-none bg-danger-500 text-white rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-danger-600" onClick={onDelete}>
              Delete
            </button>
          )}
          <div class="ml-auto flex gap-3">
            <button type="button" class="px-4 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-surface-50 dark:hover:bg-surface-700" onClick={onClose}>Cancel</button>
            <button type="submit" class="px-4 py-2.5 border-none bg-primary-500 text-white rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-600">{isEdit ? 'Save' : 'Add'}</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
