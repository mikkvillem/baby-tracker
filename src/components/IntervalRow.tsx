import type { Interval } from '../app'
import { formatIntervalDuration } from '../utils/sessionFormatters'
import { Trash2 } from 'lucide-preact'

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
      class={`flex items-center gap-3 px-4 py-3 text-sm ${
        canEdit ? 'cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-200' : ''
      }`}
      onClick={canEdit ? onEdit : undefined}
    >
      <span
        class={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
          interval.side === 'left' ? 'bg-side-left-500' : 'bg-side-right-500'
        }`}
      >
        {interval.side === 'left' ? 'L' : 'R'}
      </span>
      <span class="text-surface-600 dark:text-surface-400">
        {interval.startTime.toLocaleTimeString('en-US', timeFormat)}
      </span>
      {interval.endTime && (
        <span class="ml-auto font-semibold text-surface-800 dark:text-surface-200">
          {formatIntervalDuration(interval.startTime, interval.endTime)}
        </span>
      )}
      {!interval.endTime && (
        <span class="ml-auto flex items-center gap-1.5 text-success-500">
          <span class="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
          <span class="font-medium text-xs">Recording</span>
        </span>
      )}
      {showDelete && (
        <button
          type="button"
          class="w-7 h-7 border-none bg-transparent text-surface-400 hover:text-danger-500 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-center p-0"
          onClick={(e) => {
            e.stopPropagation()
            onDelete!()
          }}
          title="Delete interval"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}
