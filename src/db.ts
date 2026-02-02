import type { Session, MiscEvent } from './app'

const DB_NAME = 'baby-tracker-db'
const DB_VERSION = 2
const SESSIONS_STORE = 'sessions'
const MISC_EVENTS_STORE = 'misc-events'

let db: IDBDatabase | null = null

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      
      if (!database.objectStoreNames.contains(SESSIONS_STORE)) {
        database.createObjectStore(SESSIONS_STORE, { keyPath: 'id' })
      }
      
      if (!database.objectStoreNames.contains(MISC_EVENTS_STORE)) {
        database.createObjectStore(MISC_EVENTS_STORE, { keyPath: 'id' })
      }
    }
  })
}

export const saveSessions = async (sessions: Session[]): Promise<void> => {
  const database = await initDB()
  const transaction = database.transaction([SESSIONS_STORE], 'readwrite')
  const store = transaction.objectStore(SESSIONS_STORE)

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

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const loadSessions = async (): Promise<Session[]> => {
  const database = await initDB()
  const transaction = database.transaction([SESSIONS_STORE], 'readonly')
  const store = transaction.objectStore(SESSIONS_STORE)
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
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
    }
    request.onerror = () => reject(request.error)
  })
}

export const saveMiscEvent = async (event: MiscEvent): Promise<void> => {
  const database = await initDB()
  const transaction = database.transaction([MISC_EVENTS_STORE], 'readwrite')
  const store = transaction.objectStore(MISC_EVENTS_STORE)

  const eventToStore = {
    ...event,
    timestamp: event.timestamp.toISOString()
  }
  
  store.add(eventToStore)

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const loadMiscEvents = async (): Promise<MiscEvent[]> => {
  const database = await initDB()
  const transaction = database.transaction([MISC_EVENTS_STORE], 'readonly')
  const store = transaction.objectStore(MISC_EVENTS_STORE)
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const events = request.result.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }))
      resolve(events)
    }
    request.onerror = () => reject(request.error)
  })
}

export const deleteMiscEvent = async (eventId: string): Promise<void> => {
  const database = await initDB()
  const transaction = database.transaction([MISC_EVENTS_STORE], 'readwrite')
  const store = transaction.objectStore(MISC_EVENTS_STORE)
  
  store.delete(eventId)

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
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
  
  const link = document.createElement('a')
  link.href = url
  link.download = `baby-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}