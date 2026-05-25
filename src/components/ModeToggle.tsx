import type { PortionMode } from '../lib/types'

interface ModeToggleProps {
  mode: PortionMode
  onChange: (m: PortionMode) => void
}

const options: { value: PortionMode; label: string }[] = [
  { value: 'custom', label: 'Custom' },
  { value: 'equal', label: 'Equal' },
]

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="flex w-full min-w-0 rounded-lg bg-gray-200 p-1"
      role="group"
      aria-label="Portion mode"
    >
      {options.map(({ value, label }) => {
        const active = mode === value
        return (
          <button
            key={value}
            type="button"
            className={`min-h-10 min-w-0 flex-1 rounded-md px-2 text-sm font-medium transition-colors sm:px-4 ${
              active
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={active}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
