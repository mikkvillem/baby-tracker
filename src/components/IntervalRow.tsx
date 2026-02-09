import type { Interval } from '../app'
import { formatIntervalDuration } from '../utils/sessionFormatters'

type Props = {
  interval: Interval
  onDelete?: () => void
  onEdit?: () => void
}

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}

export function IntervalRow({ interval, onDelete, onEdit }: Props) {
  const canEdit = interval.endTime && onEdit
  const showDelete = interval.endTime && onDelete

  return (
    <div
      class={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm ${
        canEdit ? 'cursor-pointer hover:bg-gray-100 hover:translate-x-1 transition-all duration-200' : ''
      }`}
      onClick={canEdit ? onEdit : undefined}
    >
      <span
        class={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
          interval.side === 'left' ? 'bg-blue-500' : 'bg-purple-500'
        }`}
      >
        {interval.side === 'left' ? 'L' : 'R'}
      </span>
      <span class="text-xs sm:text-sm">
        {interval.startTime.toLocaleTimeString('en-US', timeFormat)}
      </span>
      {interval.endTime && (
        <span class="ml-auto font-semibold text-emerald-500">
          {formatIntervalDuration(interval.startTime, interval.endTime)}
        </span>
      )}
      {showDelete && (
        <button
          type="button"
          class="w-7 h-7 border-none bg-red-100 text-red-600 rounded-md text-xl leading-none cursor-pointer transition-all duration-200 hover:bg-red-200 hover:scale-110 active:scale-95 flex items-center justify-center p-0"
          onClick={(e) => {
            e.stopPropagation()
            onDelete!()
          }}
          title="Delete interval"
        >
          ×
        </button>
      )}
    </div>
  )
}
