type Props = {
  value: 'left' | 'right'
  onChange: (side: 'left' | 'right') => void
  label?: string
}

export function SideSelector({ value, onChange, label = 'Side' }: Props) {
  return (
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1.5 text-gray-700">{label}</label>
      <div class="flex gap-2">
        <button
          type="button"
          class={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            value === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onChange('left')}
        >
          Left
        </button>
        <button
          type="button"
          class={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            value === 'right' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onChange('right')}
        >
          Right
        </button>
      </div>
    </div>
  )
}
