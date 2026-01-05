import { useState } from 'preact/hooks'
import type { Session } from '../app'
import './ManualSessionModal.css'

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
    <div class="modalOverlay" onClick={onClose}>
      <div class="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>New Manual Session</h2>
        <form onSubmit={handleSubmit}>
          <div class="formField">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onInput={(e) => setDate((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="formField">
            <label>Time</label>
            <input
              type="time"
              value={time}
              onInput={(e) => setTime((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="modalActions">
            <button type="button" class="cancelButton" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" class="saveButton">
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

