import type { ReactNode } from 'react'

interface PortionDisplayProps {
  raw: ReactNode
  cooked: string
  layout?: 'inline' | 'spread'
}

function RawValue({ raw }: { raw: ReactNode }) {
  if (typeof raw === 'string') {
    return <span className="font-bold tabular-nums text-gray-900">{raw}</span>
  }
  return raw
}

export function PortionDisplay({
  raw,
  cooked,
  layout = 'inline',
}: PortionDisplayProps) {
  if (layout === 'spread') {
    return (
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div className="flex items-center gap-2 justify-self-start">
          <span className="shrink-0 text-gray-600">Raw</span>
          <RawValue raw={raw} />
        </div>
        <span
          className="justify-self-center text-gray-400"
          aria-hidden="true"
        >
          →
        </span>
        <div className="flex items-center gap-2 justify-self-end">
          <span className="shrink-0 text-gray-600">Cooked</span>
          <span className="font-bold tabular-nums text-gray-900">{cooked}</span>
        </div>
      </div>
    )
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-gray-600">Raw</span>
      <RawValue raw={raw} />
      <span className="shrink-0 text-gray-400" aria-hidden="true">
        →
      </span>
      <span className="shrink-0 text-gray-600">Cooked</span>
      <span className="font-bold tabular-nums text-gray-900">{cooked}</span>
    </span>
  )
}
