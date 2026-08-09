import { signal, effect } from '@preact/signals'

export type NotificationTiming = 'before' | 'overdue'

export type FeedingSettings = {
  intervalMinutes: number
  significantIntervalMinutes: number
  medicineOptions: string[]
  notificationsEnabled: boolean
  notificationTiming: NotificationTiming
  notificationLeadMinutes: number
  notificationOverdueMinutes: number
}

export const DEFAULT_MEDICINE_OPTIONS = [
  'Vitamin D',
  'Probiotic',
  'Paracetamol',
  'Ibuprofen',
  'Gripe water',
  'Gas drops',
  'Iron supplement',
  'Other'
]

const DEFAULT_SETTINGS: FeedingSettings = {
  intervalMinutes: 180, // 3 hours
  significantIntervalMinutes: 10,
  medicineOptions: DEFAULT_MEDICINE_OPTIONS,
  notificationsEnabled: false,
  notificationTiming: 'before',
  notificationLeadMinutes: 15,
  notificationOverdueMinutes: 15
}

const loadSettings = (): FeedingSettings => {
  try {
    const saved = localStorage.getItem('feeding-settings')
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return DEFAULT_SETTINGS
}

export const feedingSettings = signal<FeedingSettings>(loadSettings())

effect(() => {
  try {
    localStorage.setItem('feeding-settings', JSON.stringify(feedingSettings.value))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
})

export const updateSettings = (updates: Partial<FeedingSettings>) => {
  feedingSettings.value = { ...feedingSettings.value, ...updates }
}

