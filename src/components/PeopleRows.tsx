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
  const personCount = Math.max(0, Math.floor(people))
  const dayCount = Math.max(0, Math.floor(days))
  const equalDivisor = personCount * dayCount
  const equalShares = isEqual
    ? equalPortionShares(rawTotal, cookedTotal, equalDivisor)
    : null

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
    onSharesChange(next.slice(0, personCount))
  }

  if (isEqual) {
    return (
      <div className="min-w-0 divide-y divide-gray-200">
        {Array.from({ length: personCount }, (_, personOffset) => {
          const personIndex = personOffset + 1
          return (
            <section
              key={`person-${personIndex}`}
              className="flex min-w-0 flex-col gap-2 py-3 first:pt-0 last:pb-0"
            >
              <PersonPill personIndex={personIndex} />
              <ul className="flex min-w-0 flex-col gap-2 pl-1">
                {Array.from({ length: dayCount }, (_, dayOffset) => {
                  const dayIndex = dayOffset + 1
                  return (
                    <li
                      key={`person-${personIndex}-day-${dayIndex}`}
                      className="flex min-h-10 min-w-0 items-center gap-2 sm:gap-3"
                    >
                      <div className="shrink-0">
                        <DayPill dayIndex={dayIndex} />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <PortionDisplay
                          layout="spread"
                          raw={formatNumber(equalShares?.rawShare ?? 0)}
                          cooked={formatNumber(equalShares?.cookedShare ?? 0)}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-w-0">
      {Array.from({ length: personCount }, (_, index) => {
        const rawShare = rawShares[index] ?? 0
        const cooked = computeCooked(rawShare, rawTotal, cookedTotal)
        const rowIndex = index + 1

        return (
          <div
            key={`person-${rowIndex}`}
            className="flex min-h-10 min-w-0 items-center gap-2 border-b border-gray-200 py-3 last:border-b-0 sm:gap-3"
          >
            <div className="shrink-0">
              <PersonPill personIndex={rowIndex} />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <PortionDisplay
                layout="spread"
                raw={
                  <input
                    type="text"
                    inputMode="decimal"
                    className="box-border min-h-10 w-full min-w-0 max-w-full rounded-md border border-gray-300 px-2 text-center tabular-nums text-gray-900"
                    value={
                      rawShares[index] !== undefined
                        ? String(rawShares[index])
                        : ''
                    }
                    onChange={(e) => handleShareChange(index, e.target.value)}
                    aria-label={`Person ${rowIndex} raw share`}
                  />
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
