export type NotificationCapability = {
  supported: boolean
  reason?: string
}

export function checkNotificationCapability(): NotificationCapability {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { supported: false, reason: 'Notifications require a browser environment' }
  }
  if (!('Notification' in window)) {
    return { supported: false, reason: 'This browser does not support notifications' }
  }
  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'This browser does not support background notifications' }
  }
  return { supported: true }
}

export async function showFeedingNotification(isOverdue: boolean): Promise<void> {
  const title = isOverdue ? 'Feeding overdue' : 'Feeding time approaching'
  const body = isOverdue
    ? "It's past the suggested feeding time."
    : 'The suggested feeding time is coming up soon.'
  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'feeding-reminder'
  }

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
