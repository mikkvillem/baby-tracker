import { useCallback, useEffect, useState } from 'preact/hooks'

const DISMISSED_KEY = 'pwa-install-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === 'true'
  } catch (e) {
    console.error('Failed to read PWA install dismissal:', e)
    return false
  }
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(isDismissed)

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true')
    } catch (e) {
      console.error('Failed to persist PWA install dismissal:', e)
    }
    setDismissed(true)
  }, [])

  useEffect(() => {
    if (isStandalone()) return

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      dismiss()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [dismiss])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (choice.outcome !== 'accepted') {
      dismiss()
    }
  }, [deferredPrompt, dismiss])

  return {
    canInstall: !!deferredPrompt && !dismissed,
    promptInstall,
    dismiss
  }
}
