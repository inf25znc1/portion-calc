import type { HistoryEntry } from '../lib/types'
import { formatNumber, getHistoryPortions } from '../lib/math'
import { PersonPill } from './PersonPill'
import { PortionDisplay } from './PortionDisplay'

interface HistoryItemProps {
  entry: HistoryEntry
  onLoad: () => void
  onDelete: () => void
}

export function HistoryItem({ entry, onLoad, onDelete }: HistoryItemProps) {
  const name = entry.ingredient.trim() || 'Unnamed'
  const portions = getHistoryPortions(entry)

  return (
    <div
      onClick={onLoad}
      className="relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 pr-10 text-left shadow-sm transition-colors hover:border-gray-300"
    >
      <button
        type="button"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Delete ${name}`}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        ×
      </button>

      <p className="font-medium text-gray-900">{name}</p>
      <p className="mt-1">
        <PortionDisplay
          raw={formatNumber(entry.rawTotal)}
          cooked={formatNumber(entry.cookedTotal)}
        />
      </p>

      {portions.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {portions.map((portion) => (
            <li
              key={portion.personIndex}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <PersonPill personIndex={portion.personIndex} />
              <PortionDisplay
                raw={formatNumber(portion.rawShare)}
                cooked={formatNumber(portion.cooked)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
