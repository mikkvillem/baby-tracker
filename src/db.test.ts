import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import type { Session, MiscEvent } from './app'

let db: typeof import('./db')

const sampleSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-1',
  startTime: new Date('2026-08-01T08:00:00.000Z'),
  isActive: false,
  intervals: [
    {
      side: 'left',
      startTime: new Date('2026-08-01T08:00:00.000Z'),
      endTime: new Date('2026-08-01T08:10:00.000Z')
    }
  ],
  ...overrides
})

const sampleEvent = (overrides: Partial<MiscEvent> = {}): MiscEvent => ({
  id: 'event-1',
  type: 'diaper',
  diaperPee: true,
  timestamp: new Date('2026-08-01T09:00:00.000Z'),
  ...overrides
})

const backupJSON = (sessions: unknown[], miscEvents: unknown[]) =>
  JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '2.0',
    sessions,
    miscEvents
  })

const exportSession = (session: Session) => ({
  ...session,
  startTime: session.startTime.toISOString(),
  intervals: session.intervals.map(interval => ({
    ...interval,
    startTime: interval.startTime.toISOString(),
    endTime: interval.endTime ? interval.endTime.toISOString() : undefined
  }))
})

const exportEvent = (event: MiscEvent) => ({
  ...event,
  timestamp: event.timestamp.toISOString()
})

beforeEach(async () => {
  // Fully reset both the fake IndexedDB storage and the db.ts module's
  // cached connection, so every test starts from a clean database.
  globalThis.indexedDB = new IDBFactory()
  vi.resetModules()
  db = await import('./db')
})

describe('importDataFromJSON', () => {
  it('imports sessions and misc events from a valid backup', async () => {
    const session = sampleSession()
    const event = sampleEvent()
    const json = backupJSON([exportSession(session)], [exportEvent(event)])

    const result = await db.importDataFromJSON(json)

    expect(result).toEqual({
      sessionsImported: 1,
      sessionsSkipped: 0,
      eventsImported: 1,
      eventsSkipped: 0
    })

    const sessions = await db.loadSessions()
    const events = await db.loadMiscEvents()
    expect(sessions).toEqual([session])
    expect(events).toEqual([event])
  })

  it('skips items that were already imported instead of duplicating them', async () => {
    const json = backupJSON([exportSession(sampleSession())], [exportEvent(sampleEvent())])

    await db.importDataFromJSON(json)
    const secondResult = await db.importDataFromJSON(json)

    expect(secondResult).toEqual({
      sessionsImported: 0,
      sessionsSkipped: 1,
      eventsImported: 0,
      eventsSkipped: 1
    })

    const sessions = await db.loadSessions()
    const events = await db.loadMiscEvents()
    expect(sessions).toHaveLength(1)
    expect(events).toHaveLength(1)
  })

  it('merges imported data with existing data instead of replacing it', async () => {
    const existingSession = sampleSession({ id: 'existing-session' })
    const existingEvent = sampleEvent({ id: 'existing-event' })
    await db.saveSessions([existingSession])
    await db.saveMiscEvent(existingEvent)

    const importedSession = sampleSession({ id: 'imported-session' })
    const importedEvent = sampleEvent({ id: 'imported-event' })
    const json = backupJSON([exportSession(importedSession)], [exportEvent(importedEvent)])

    await db.importDataFromJSON(json)

    const sessionIds = (await db.loadSessions()).map(s => s.id).sort()
    const eventIds = (await db.loadMiscEvents()).map(e => e.id).sort()
    expect(sessionIds).toEqual(['existing-session', 'imported-session'])
    expect(eventIds).toEqual(['existing-event', 'imported-event'])
  })

  it('drops malformed entries while still importing the valid ones', async () => {
    const validSession = exportSession(sampleSession({ id: 'valid-session' }))
    const invalidSession = { id: 'bad-session', startTime: 'not-a-date', intervals: [] }
    const validEvent = exportEvent(sampleEvent({ id: 'valid-event' }))
    const invalidEvent = { id: 'bad-event', type: 'diaper', timestamp: 'not-a-date' }

    const json = backupJSON([validSession, invalidSession], [validEvent, invalidEvent])

    await db.importDataFromJSON(json)

    const sessionIds = (await db.loadSessions()).map(s => s.id)
    const eventIds = (await db.loadMiscEvents()).map(e => e.id)
    expect(sessionIds).toEqual(['valid-session'])
    expect(eventIds).toEqual(['valid-event'])
  })

  it('rejects a file that is not valid JSON', async () => {
    await expect(db.importDataFromJSON('not json')).rejects.toThrow(db.DBError)
    await expect(db.importDataFromJSON('not json')).rejects.toThrow(/not valid JSON/)
  })

  it('rejects a file whose shape does not match the backup format', async () => {
    await expect(db.importDataFromJSON('{}')).rejects.toThrow(db.DBError)
    await expect(db.importDataFromJSON(JSON.stringify({ sessions: [] }))).rejects.toThrow(
      /expected backup format/
    )
    await expect(db.importDataFromJSON(JSON.stringify([1, 2, 3]))).rejects.toThrow(db.DBError)
  })

  it('does not touch the database when the file is invalid', async () => {
    const existingSession = sampleSession()
    await db.saveSessions([existingSession])

    await expect(db.importDataFromJSON('not json')).rejects.toThrow()

    const sessions = await db.loadSessions()
    expect(sessions).toEqual([existingSession])
  })
})

describe('exportDataAsJSON', () => {
  it('serializes sessions and misc events as downloadable JSON matching the import format', async () => {
    const session = sampleSession()
    const event = sampleEvent()
    await db.saveSessions([session])
    await db.saveMiscEvent(event)

    let capturedBlob: Blob | null = null
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((obj) => {
      capturedBlob = obj as Blob
      return 'blob:mock-url'
    })
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    // jsdom doesn't implement navigation; the download link's default click
    // action would otherwise log a "not implemented" error.
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await db.exportDataAsJSON()

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    expect(capturedBlob).not.toBeNull()

    const text = await capturedBlob!.text()
    const parsed = JSON.parse(text)
    expect(parsed.sessions).toEqual([exportSession(session)])
    expect(parsed.miscEvents).toEqual([exportEvent(event)])

    // What exportDataAsJSON produces should be accepted by importDataFromJSON.
    globalThis.indexedDB = new IDBFactory()
    vi.resetModules()
    const freshDb: typeof import('./db') = await import('./db')
    const result = await freshDb.importDataFromJSON(text)
    expect(result).toEqual({
      sessionsImported: 1,
      sessionsSkipped: 0,
      eventsImported: 1,
      eventsSkipped: 0
    })

    createObjectURL.mockRestore()
    revokeObjectURL.mockRestore()
    anchorClick.mockRestore()
  })
})
