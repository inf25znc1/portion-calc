import type { PortionMode } from '../lib/types'
import { computeCooked, formatNumber } from '../lib/math'
import { PersonPill } from './PersonPill'
import { PortionDisplay } from './PortionDisplay'

interface PeopleRowsProps {
  mode: PortionMode
  people: number
  rawTotal: number
  cookedTotal: number
  rawShares: number[]
  onSharesChange: (shares: number[]) => void
}

function equalRawShare(rawTotal: number, people: number): number {
  if (!Number.isFinite(people) || people <= 0) {
    return 0
  }
  return rawTotal / people
}

export function PeopleRows({
  mode,
  people,
  rawTotal,
  cookedTotal,
  rawShares,
  onSharesChange,
}: PeopleRowsProps) {
  const count = Math.max(0, Math.floor(people))

  const handleShareChange = (index: number, value: string) => {
    const next = [...rawShares]
    if (value === '') {
      delete next[index]
    } else {
      const parsed = parseFloat(value)
      if (Number.isFinite(parsed)) {
        next[index] = parsed
      }
    }
    onSharesChange(next.slice(0, count))
  }

  return (
    <div>
      {Array.from({ length: count }, (_, index) => {
        const rawShare =
          mode === 'equal'
            ? equalRawShare(rawTotal, count)
            : (rawShares[index] ?? 0)
        const cooked = computeCooked(rawShare, rawTotal, cookedTotal)

        return (
          <div
            key={index}
            className="flex min-h-10 items-center gap-3 border-b border-gray-200 py-3 last:border-b-0"
          >
            <PersonPill personIndex={index + 1} />

            <div className="min-w-0 flex-1">
              <PortionDisplay
                layout="spread"
                raw={
                  mode === 'equal' ? (
                    formatNumber(rawShare)
                  ) : (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="box-border min-h-10 w-[calc(5ch+1rem)] shrink-0 rounded-md border border-gray-300 px-2 text-center tabular-nums text-gray-900"
                      value={
                        rawShares[index] !== undefined
                          ? String(rawShares[index])
                          : ''
                      }
                      onChange={(e) =>
                        handleShareChange(index, e.target.value)
                      }
                      aria-label={`Person ${index + 1} raw share`}
                    />
                  )
                }
                cooked={formatNumber(cooked)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
