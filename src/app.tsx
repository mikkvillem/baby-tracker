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

export type MiscEventType = 'diaper' | 'medicine' | 'measurement' | 'custom' | 'vitamin' | 'probiotic'

export type MeasurementKind = 'weight' | 'height' | 'headCircumference'

export type MiscEvent = {
  id: string
  type: MiscEventType
  customLabel?: string
  medicineName?: string
  measurementKind?: MeasurementKind
  measurementValue?: number
  measurementUnit?: string
  timestamp: Date
  notes?: string
}
