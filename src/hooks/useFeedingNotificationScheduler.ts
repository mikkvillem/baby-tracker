import { useEffect } from 'preact/hooks'
import { feedingSettings } from '../store/settings'
import { getNotificationFireTime, suggestNextFeeding } from '../utils/feedingPredictor'
import { checkNotificationCapability, showFeedingNotification } from '../utils/notifications'
import { loadSessions } from '../db'

const LAST_NOTIFIED_KEY = 'feeding-notification-last-fired'
const CHECK_INTERVAL_MS = 60000

// Runs while the app/tab is open (foreground or backgrounded). There is no
// server, so this cannot wake the app once it is fully closed - it polls at
// minute granularity, matching the rest of the app's feeding countdown.
export function useFeedingNotificationScheduler() {
  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const settings = feedingSettings.value
      if (!settings.notificationsEnabled) return
      if (!checkNotificationCapability().supported) return
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

      let sessions
      try {
        sessions = await loadSessions()
      } catch (error) {
        console.error('Failed to load sessions for feeding notification check:', error)
        return
      }
      if (cancelled) return

      const prediction = suggestNextFeeding(sessions, settings.intervalMinutes, settings.significantIntervalMinutes)
      const fireTime = getNotificationFireTime(
        prediction.suggestedTime,
        settings.notificationTiming,
        settings.notificationLeadMinutes,
        settings.notificationOverdueMinutes
      )
      if (!fireTime || fireTime.getTime() > Date.now()) return

      const key = fireTime.toISOString()
      if (localStorage.getItem(LAST_NOTIFIED_KEY) === key) return
      localStorage.setItem(LAST_NOTIFIED_KEY, key)
      showFeedingNotification(settings.notificationTiming === 'overdue')
    }

    check()
    const id = setInterval(check, CHECK_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])
}
