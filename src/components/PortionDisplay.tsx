import type { ReactNode } from 'react'

interface PortionDisplayProps {
  raw: ReactNode
  cooked: string
  layout?: 'inline' | 'spread'
}

function RawValue({ raw }: { raw: ReactNode }) {
  if (typeof raw === 'string') {
    return (
      <span className="min-w-0 truncate font-bold tabular-nums text-gray-900">
        {raw}
      </span>
    )
  }
  return <div className="min-w-0 w-full max-w-full">{raw}</div>
}

export function PortionDisplay({
  raw,
  cooked,
  layout = 'inline',
}: PortionDisplayProps) {
  if (layout === 'spread') {
    return (
      <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-sm sm:gap-2">
        <div className="flex min-w-0 items-center gap-1 justify-self-start overflow-hidden sm:gap-2">
          <span className="shrink-0 text-gray-600">Raw</span>
          <RawValue raw={raw} />
        </div>
        <span
          className="shrink-0 justify-self-center px-0.5 text-gray-400"
          aria-hidden="true"
        >
          →
        </span>
        <div className="flex min-w-0 items-center gap-1 justify-self-end overflow-hidden sm:gap-2">
          <span className="shrink-0 text-gray-600">Cooked</span>
          <span className="min-w-0 truncate font-bold tabular-nums text-gray-900">
            {cooked}
          </span>
        </div>
      </div>
    )
  }

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-gray-600">Raw</span>
        <RawValue raw={raw} />
      </span>
      <span className="shrink-0 text-gray-400" aria-hidden="true">
        →
      </span>
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-gray-600">Cooked</span>
        <span className="min-w-0 truncate font-bold tabular-nums text-gray-900">
          {cooked}
        </span>
      </span>
    </span>
  )
}
