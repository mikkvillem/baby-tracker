import { useCallback, useState } from 'preact/hooks'
import { checkNotificationCapability } from '../utils/notifications'

export function useNotificationPermission() {
  const [capability] = useState(() => checkNotificationCapability())
  const [permission, setPermission] = useState<NotificationPermission | null>(
    capability.supported ? Notification.permission : null
  )

  const requestPermission = useCallback(async (): Promise<NotificationPermission | null> => {
    if (!capability.supported) return null
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [capability.supported])

  return {
    supported: capability.supported,
    unsupportedReason: capability.reason,
    permission,
    requestPermission
  }
}
