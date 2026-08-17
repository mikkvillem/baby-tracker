import { translations } from '../i18n'

export type NotificationCapability = {
  supported: boolean
  reason?: string
}

export function checkNotificationCapability(): NotificationCapability {
  const t = translations.value.notifications
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { supported: false, reason: t.unsupportedNoBrowser }
  }
  if (!('Notification' in window)) {
    return { supported: false, reason: t.unsupportedNoApi }
  }
  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: t.unsupportedNoServiceWorker }
  }
  return { supported: true }
}

async function dispatchNotification(title: string, options: NotificationOptions): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>(resolve => setTimeout(() => resolve(null), 3000))
      ])
      if (registration) {
        await registration.showNotification(title, options)
        return
      }
      console.warn('No active service worker after 3s, falling back to a plain notification')
    } catch (error) {
      console.error('Failed to show notification via service worker:', error)
    }
  }

  try {
    new Notification(title, options)
  } catch (error) {
    console.error('Failed to show notification:', error)
  }
}

export async function showFeedingNotification(isOverdue: boolean): Promise<void> {
  const t = translations.value.notifications
  const title = isOverdue ? t.feedingOverdueTitle : t.feedingApproachingTitle
  const body = isOverdue ? t.feedingOverdueBody : t.feedingApproachingBody
  await dispatchNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'feeding-reminder'
  })
}

export async function showTestNotification(): Promise<void> {
  const t = translations.value.notifications
  await dispatchNotification(t.testTitle, {
    body: t.testBody,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'feeding-reminder-test'
  })
}
