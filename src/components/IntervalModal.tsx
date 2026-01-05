import { useState } from 'preact/hooks'
import type { Interval } from '../app'
import './ManualSessionModal.css'

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
    <div class="modalOverlay" onClick={onClose}>
      <div class="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Interval' : 'Add Interval'}</h2>
        <form onSubmit={handleSubmit}>
          <div class="formField">
            <label>Side</label>
            <select
              value={side}
              onChange={(e) => setSide((e.target as HTMLSelectElement).value as 'left' | 'right')}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div class="formField">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onInput={(e) => setStartDate((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          
          <div class="formField">
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onInput={(e) => setStartTime((e.target as HTMLInputElement).value)}
              required
            />
          </div>

          <div class="formField">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          
          <div class="formField">
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onInput={(e) => setEndTime((e.target as HTMLInputElement).value)}
              required
            />
          </div>

          <div class="modalActions">
            {isEdit && onDelete && (
              <button type="button" class="deleteButton" onClick={onDelete}>
                Delete
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button type="button" class="cancelButton" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" class="saveButton">
                {isEdit ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

