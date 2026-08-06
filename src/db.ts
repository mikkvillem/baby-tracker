import type { Session, MiscEvent } from './app'

const DB_NAME = 'baby-tracker-db'
const DB_VERSION = 2
const SESSIONS_STORE = 'sessions'
const MISC_EVENTS_STORE = 'misc-events'

export class DBError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'DBError'
    this.cause = cause
  }
}

let db: IDBDatabase | null = null
let dbPromise: Promise<IDBDatabase> | null = null

const describeRequestError = (error: DOMException | null, fallback: string): string =>
  error ? `${fallback}: ${error.name} - ${error.message}` : fallback

export const initDB = (): Promise<IDBDatabase> => {
  if (db) {
    return Promise.resolve(db)
  }

  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      dbPromise = null
      reject(new DBError('IndexedDB is not available in this browser'))
      return
    }

    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION)
    } catch (error) {
      dbPromise = null
      reject(new DBError('Failed to open database', error))
      return
    }

    request.onerror = () => {
      dbPromise = null
      reject(new DBError(describeRequestError(request.error, 'Failed to open database'), request.error))
    }

    request.onblocked = () => {
      dbPromise = null
      reject(new DBError('Database upgrade is blocked by another open tab. Please close other tabs of this app and retry.'))
    }

    request.onsuccess = () => {
      db = request.result
      db.onversionchange = () => {
        db?.close()
        db = null
      }
      db.onclose = () => {
        db = null
      }
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      try {
        const database = (event.target as IDBOpenDBRequest).result

        if (!database.objectStoreNames.contains(SESSIONS_STORE)) {
          database.createObjectStore(SESSIONS_STORE, { keyPath: 'id' })
        }

        if (!database.objectStoreNames.contains(MISC_EVENTS_STORE)) {
          database.createObjectStore(MISC_EVENTS_STORE, { keyPath: 'id' })
        }
      } catch (error) {
        dbPromise = null
        reject(new DBError('Failed to set up database schema', error))
      }
    }
  })

  return dbPromise
}

export const saveSessions = async (sessions: Session[]): Promise<void> => {
  const database = await initDB()

  let transaction: IDBTransaction
  let store: IDBObjectStore
  try {
    transaction = database.transaction([SESSIONS_STORE], 'readwrite')
    store = transaction.objectStore(SESSIONS_STORE)
    store.clear()

    for (const session of sessions) {
      const sessionToStore = {
        ...session,
        startTime: session.startTime.toISOString(),
        intervals: session.intervals.map(interval => ({
          ...interval,
          startTime: interval.startTime.toISOString(),
          endTime: interval.endTime ? interval.endTime.toISOString() : undefined
        }))
      }
      store.add(sessionToStore)
    }
  } catch (error) {
    throw new DBError('Failed to save sessions', error)
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new DBError(describeRequestError(transaction.error, 'Failed to save sessions'), transaction.error))
    transaction.onabort = () => reject(new DBError(describeRequestError(transaction.error, 'Save sessions transaction was aborted'), transaction.error))
  })
}

export const loadSessions = async (): Promise<Session[]> => {
  const database = await initDB()

  let request: IDBRequest<any[]>
  try {
    const transaction = database.transaction([SESSIONS_STORE], 'readonly')
    const store = transaction.objectStore(SESSIONS_STORE)
    request = store.getAll()
  } catch (error) {
    throw new DBError('Failed to load sessions', error)
  }

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      try {
        const sessions = request.result.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          intervals: session.intervals.map((interval: any) => ({
            ...interval,
            startTime: new Date(interval.startTime),
            endTime: interval.endTime ? new Date(interval.endTime) : undefined
          }))
        }))
        resolve(sessions)
      } catch (error) {
        reject(new DBError('Failed to parse stored sessions', error))
      }
    }
    request.onerror = () => reject(new DBError(describeRequestError(request.error, 'Failed to load sessions'), request.error))
  })
}

export const saveMiscEvent = async (event: MiscEvent): Promise<void> => {
  const database = await initDB()

  let transaction: IDBTransaction
  try {
    transaction = database.transaction([MISC_EVENTS_STORE], 'readwrite')
    const store = transaction.objectStore(MISC_EVENTS_STORE)

    const eventToStore = {
      ...event,
      timestamp: event.timestamp.toISOString()
    }

    store.add(eventToStore)
  } catch (error) {
    throw new DBError('Failed to save event', error)
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new DBError(describeRequestError(transaction.error, 'Failed to save event'), transaction.error))
    transaction.onabort = () => reject(new DBError(describeRequestError(transaction.error, 'Save event transaction was aborted'), transaction.error))
  })
}

export const loadMiscEvents = async (): Promise<MiscEvent[]> => {
  const database = await initDB()

  let request: IDBRequest<any[]>
  try {
    const transaction = database.transaction([MISC_EVENTS_STORE], 'readonly')
    const store = transaction.objectStore(MISC_EVENTS_STORE)
    request = store.getAll()
  } catch (error) {
    throw new DBError('Failed to load events', error)
  }

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      try {
        const events = request.result.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }))
        resolve(events)
      } catch (error) {
        reject(new DBError('Failed to parse stored events', error))
      }
    }
    request.onerror = () => reject(new DBError(describeRequestError(request.error, 'Failed to load events'), request.error))
  })
}

export const deleteMiscEvent = async (eventId: string): Promise<void> => {
  const database = await initDB()

  let transaction: IDBTransaction
  try {
    transaction = database.transaction([MISC_EVENTS_STORE], 'readwrite')
    const store = transaction.objectStore(MISC_EVENTS_STORE)
    store.delete(eventId)
  } catch (error) {
    throw new DBError('Failed to delete event', error)
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new DBError(describeRequestError(transaction.error, 'Failed to delete event'), transaction.error))
    transaction.onabort = () => reject(new DBError(describeRequestError(transaction.error, 'Delete event transaction was aborted'), transaction.error))
  })
}

export const exportDataAsJSON = async (): Promise<void> => {
  const sessions = await loadSessions()
  const miscEvents = await loadMiscEvents()

  const exportData = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    sessions: sessions.map(session => ({
      ...session,
      startTime: session.startTime.toISOString(),
      intervals: session.intervals.map(interval => ({
        ...interval,
        startTime: interval.startTime.toISOString(),
        endTime: interval.endTime ? interval.endTime.toISOString() : undefined
      }))
    })),
    miscEvents: miscEvents.map(event => ({
      ...event,
      timestamp: event.timestamp.toISOString()
    }))
  }

  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  try {
    const link = document.createElement('a')
    link.href = url
    link.download = `baby-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(url)
  }
}
