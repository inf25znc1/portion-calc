import type { HistoryEntry } from '../lib/types'
import { formatNumber, getHistoryPortions } from '../lib/math'
import { PersonPill } from './PersonPill'
import { DayPill } from './DayPill'
import { PortionDisplay } from './PortionDisplay'

interface HistoryItemProps {
  entry: HistoryEntry
  onLoad: () => void
  onDelete: () => void
}

export function HistoryItem({ entry, onLoad, onDelete }: HistoryItemProps) {
  const name = entry.ingredient.trim() || 'Unnamed'
  const portions = getHistoryPortions(entry)
  const isEqual = entry.mode === 'equal'

  const groupedByPerson = isEqual
    ? portions.reduce<Map<number, typeof portions>>((map, portion) => {
        const list = map.get(portion.personIndex) ?? []
        list.push(portion)
        map.set(portion.personIndex, list)
        return map
      }, new Map())
    : null

  return (
    <div
      onClick={onLoad}
      className="relative w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 pr-10 text-left shadow-sm transition-colors hover:border-gray-300"
    >
      <button
        type="button"
        className="absolute right-2 top-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Delete ${name}`}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        ×
      </button>

      <p className="truncate pr-2 font-medium text-gray-900">{name}</p>
      <p className="mt-1 min-w-0 overflow-hidden">
        <PortionDisplay
          raw={formatNumber(entry.rawTotal)}
          cooked={formatNumber(entry.cookedTotal)}
        />
      </p>

      {portions.length > 0 && isEqual && groupedByPerson && (
        <div className="mt-2 flex min-w-0 flex-col gap-3">
          {[...groupedByPerson.entries()].map(([personIndex, dayPortions]) => (
            <div key={`person-${personIndex}`} className="min-w-0">
              <PersonPill personIndex={personIndex} />
              <ul className="mt-1.5 flex min-w-0 flex-col gap-1.5 pl-1">
                {dayPortions.map((portion) => (
                  <li
                    key={`person-${portion.personIndex}-day-${portion.dayIndex}`}
                    className="flex min-w-0 items-center gap-2 text-sm text-gray-600"
                  >
                    <div className="shrink-0">
                      <DayPill dayIndex={portion.dayIndex ?? 1} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <PortionDisplay
                        raw={formatNumber(portion.rawShare)}
                        cooked={formatNumber(portion.cooked)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {portions.length > 0 && !isEqual && (
        <ul className="mt-2 flex min-w-0 flex-col gap-1.5">
          {portions.map((portion) => (
            <li
              key={`person-${portion.personIndex}`}
              className="flex min-w-0 items-center gap-2 text-sm text-gray-600"
            >
              <div className="shrink-0">
                <PersonPill personIndex={portion.personIndex} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <PortionDisplay
                  raw={formatNumber(portion.rawShare)}
                  cooked={formatNumber(portion.cooked)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
