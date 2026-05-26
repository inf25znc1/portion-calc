import type { PortionMode } from '../lib/types'
import { computeCooked, equalPortionShares, formatNumber } from '../lib/math'
import { PersonPill } from './PersonPill'
import { DayPill } from './DayPill'
import { PortionDisplay } from './PortionDisplay'

interface PeopleRowsProps {
  mode: PortionMode
  people: number
  days: number
  rawTotal: number
  cookedTotal: number
  rawShares: number[]
  onSharesChange: (shares: number[]) => void
}

export function PeopleRows({
  mode,
  people,
  days,
  rawTotal,
  cookedTotal,
  rawShares,
  onSharesChange,
}: PeopleRowsProps) {
  const isEqual = mode === 'equal'
  const count = isEqual
    ? Math.max(0, Math.floor(days))
    : Math.max(0, Math.floor(people))

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
    <div className="min-w-0">
      {Array.from({ length: count }, (_, index) => {
        const equalShares = isEqual
          ? equalPortionShares(rawTotal, cookedTotal, count)
          : null
        const rawShare = isEqual
          ? (equalShares?.rawShare ?? 0)
          : (rawShares[index] ?? 0)
        const cooked = isEqual
          ? (equalShares?.cookedShare ?? 0)
          : computeCooked(rawShare, rawTotal, cookedTotal)
        const rowIndex = index + 1

        return (
          <div
            key={isEqual ? `day-${rowIndex}` : `person-${rowIndex}`}
            className="flex min-h-10 min-w-0 items-center gap-2 border-b border-gray-200 py-3 last:border-b-0 sm:gap-3"
          >
            <div className="shrink-0">
              {isEqual ? (
                <DayPill dayIndex={rowIndex} />
              ) : (
                <PersonPill personIndex={rowIndex} />
              )}
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <PortionDisplay
                layout="spread"
                raw={
                  isEqual ? (
                    formatNumber(rawShare)
                  ) : (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="box-border min-h-10 w-full min-w-0 max-w-full rounded-md border border-gray-300 px-2 text-center tabular-nums text-gray-900"
                      value={
                        rawShares[index] !== undefined
                          ? String(rawShares[index])
                          : ''
                      }
                      onChange={(e) =>
                        handleShareChange(index, e.target.value)
                      }
                      aria-label={`Person ${rowIndex} raw share`}
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
