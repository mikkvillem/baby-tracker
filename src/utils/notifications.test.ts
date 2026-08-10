import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkNotificationCapability, showFeedingNotification } from './notifications'

describe('checkNotificationCapability', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports unsupported when the Notification API is missing', () => {
    vi.stubGlobal('Notification', undefined)
    const result = checkNotificationCapability()
    expect(result.supported).toBe(false)
    expect(result.reason).toBeTruthy()
  })

  it('reports unsupported when service workers are unavailable', () => {
    vi.stubGlobal('Notification', class {})
    const navigatorWithoutServiceWorker = { ...navigator }
    delete (navigatorWithoutServiceWorker as { serviceWorker?: unknown }).serviceWorker
    vi.stubGlobal('navigator', navigatorWithoutServiceWorker)
    const result = checkNotificationCapability()
    expect(result.supported).toBe(false)
  })

  it('reports supported when both APIs are present', () => {
    vi.stubGlobal('Notification', class {})
    vi.stubGlobal('navigator', { ...navigator, serviceWorker: {} })
    const result = checkNotificationCapability()
    expect(result.supported).toBe(true)
  })
})

describe('showFeedingNotification', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('falls back to a plain Notification when serviceWorker.ready never resolves', async () => {
    vi.useFakeTimers()
    const notificationSpy = vi.fn()
    vi.stubGlobal('Notification', notificationSpy)
    vi.stubGlobal('navigator', {
      ...navigator,
      // Simulate a service worker that never activates (e.g. dev mode without one registered).
      serviceWorker: { ready: new Promise(() => {}) }
    })

    const promise = showFeedingNotification(true)
    await vi.advanceTimersByTimeAsync(3000)
    await promise

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy.mock.calls[0][0]).toBe('Feeding overdue')
  })

  it('uses the service worker registration when it is ready', async () => {
    const showNotification = vi.fn()
    vi.stubGlobal('Notification', class {})
    vi.stubGlobal('navigator', {
      ...navigator,
      serviceWorker: { ready: Promise.resolve({ showNotification }) }
    })

    await showFeedingNotification(false)

    expect(showNotification).toHaveBeenCalledTimes(1)
    expect(showNotification.mock.calls[0][0]).toBe('Feeding time approaching')
  })
})
