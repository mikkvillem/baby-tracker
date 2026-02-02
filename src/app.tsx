import './app.css'

export type Session = {
  id: string
  startTime: Date
  intervals: Interval[]
  isActive: boolean
}

export type Interval = {
  side: 'left' | 'right'
  startTime: Date
  endTime?: Date
}

export type MiscEventType = 'diaper' | 'vitamin' | 'probiotic' | 'custom'

export type MiscEvent = {
  id: string
  type: MiscEventType
  customLabel?: string
  timestamp: Date
  notes?: string
}
