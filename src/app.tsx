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
