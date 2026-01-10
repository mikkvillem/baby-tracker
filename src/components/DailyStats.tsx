import type { Session } from '../app'

type Props = {
  sessions: Session[]
}

export function DailyStats({ sessions }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime)
    sessionDate.setHours(0, 0, 0, 0)
    return sessionDate.getTime() === today.getTime()
  })

  const totalSessions = todaySessions.length

  const getTotalTimeForSide = (side: 'left' | 'right'): number => {
    return todaySessions.reduce((total, session) => {
      const sideTime = session.intervals
        .filter(i => i.side === side && i.endTime)
        .reduce((sum, i) => sum + (i.endTime!.getTime() - i.startTime.getTime()), 0)
      return total + sideTime
    }, 0)
  }

  const formatTime = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getLastOfferedSide = (): 'left' | 'right' | null => {
    if (sessions.length === 0) return null
    
    const sortedSessions = [...sessions].sort((a, b) => 
      b.startTime.getTime() - a.startTime.getTime()
    )

    for (const session of sortedSessions) {
      if (session.intervals.length > 0) {
        const lastInterval = session.intervals[session.intervals.length - 1]
        if (lastInterval.endTime) {
          return lastInterval.side
        }
      }
    }
    return null
  }

  const leftTime = getTotalTimeForSide('left')
  const rightTime = getTotalTimeForSide('right')
  const lastSide = getLastOfferedSide()

  return (
    <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
      <h2 class="text-lg font-semibold mb-4 m-0">Today's Summary</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <div class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{totalSessions}</div>
          <div class="text-xs sm:text-sm text-gray-600">Sessions</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{formatTime(leftTime)}</div>
          <div class="text-xs sm:text-sm text-gray-600">Left</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{formatTime(rightTime)}</div>
          <div class="text-xs sm:text-sm text-gray-600">Right</div>
        </div>
        <div class={`rounded-lg p-3 text-center ${
          lastSide === 'left' ? 'bg-blue-50' : lastSide === 'right' ? 'bg-purple-50' : 'bg-gray-50'
        }`}>
          <div class={`text-2xl sm:text-3xl font-bold mb-1 ${
            lastSide === 'left' ? 'text-blue-600' : lastSide === 'right' ? 'text-purple-600' : 'text-gray-600'
          }`}>
            {lastSide ? lastSide[0].toUpperCase() : '-'}
          </div>
          <div class="text-xs sm:text-sm text-gray-600">Last Side</div>
        </div>
      </div>
    </div>
  )
}

