import { describe, expect, it } from 'vitest'
import { getNotificationFireTime } from './feedingPredictor'

describe('getNotificationFireTime', () => {
  const suggestedTime = new Date('2026-08-09T12:00:00.000Z')

  it('returns null when there is no suggested time', () => {
    expect(getNotificationFireTime(null, 'before', 15, 15)).toBeNull()
  })

  it('fires before the suggested time when timing is "before"', () => {
    const fireTime = getNotificationFireTime(suggestedTime, 'before', 15, 30)
    expect(fireTime).toEqual(new Date('2026-08-09T11:45:00.000Z'))
  })

  it('fires after the suggested time when timing is "overdue"', () => {
    const fireTime = getNotificationFireTime(suggestedTime, 'overdue', 15, 30)
    expect(fireTime).toEqual(new Date('2026-08-09T12:30:00.000Z'))
  })
})
