interface StepperControlProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  decreaseLabel: string
  increaseLabel: string
}

export function StepperControl({
  label,
  value,
  min,
  max,
  onChange,
  decreaseLabel,
  increaseLabel,
}: StepperControlProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="shrink-0 text-sm font-medium text-gray-700">{label}</span>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          disabled={value <= min}
          aria-label={decreaseLabel}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <span className="min-w-8 text-center text-lg font-medium text-gray-900">
          {value}
        </span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          disabled={value >= max}
          aria-label={increaseLabel}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}
