import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkNotificationCapability } from './notifications'

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
