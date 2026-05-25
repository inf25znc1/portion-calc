import type { HistoryEntry } from '../lib/types'
import { HistoryItem } from './HistoryItem'

interface HistoryListProps {
  entries: HistoryEntry[]
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function HistoryList({
  entries,
  onLoad,
  onDelete,
  onClearAll,
}: HistoryListProps) {
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <section className="min-w-0">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <h2 className="min-w-0 truncate text-lg font-semibold text-gray-900">
          History ({entries.length})
        </h2>
        {entries.length > 0 && (
          <button
            type="button"
            className="flex min-h-10 shrink-0 items-center gap-1 rounded-md px-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear all history"
            onClick={onClearAll}
          >
            <span aria-hidden="true">🗑</span>
            Clear all
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No saved calculations yet</p>
      ) : (
        <ul className="flex min-w-0 flex-col gap-3">
          {sorted.map((entry) => (
            <li key={entry.id} className="min-w-0">
              <HistoryItem
                entry={entry}
                onLoad={() => onLoad(entry.id)}
                onDelete={() => onDelete(entry.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
