import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { HistoryEntry, PortionMode } from '../lib/types'
import { ModeToggle } from './ModeToggle'
import { PeopleRows } from './PeopleRows'
import { HistoryList } from './HistoryList'

const HISTORY_KEY = 'portion-calc-history'
const DEFAULT_PEOPLE = 2
const MIN_PEOPLE = 1
const MAX_PEOPLE = 20

function resizeRawShares(shares: number[], count: number): number[] {
  return shares.slice(0, count)
}

function initialRawShares(): number[] {
  return []
}

function parseDecimal(value: string): number {
  if (value === '') {
    return 0
  }
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function Calculator() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(HISTORY_KEY, [])

  const [ingredient, setIngredient] = useState('')
  const [rawTotal, setRawTotal] = useState(0)
  const [cookedTotal, setCookedTotal] = useState(0)
  const [people, setPeople] = useState(DEFAULT_PEOPLE)
  const [mode, setMode] = useState<PortionMode>('custom')
  const [rawShares, setRawShares] = useState<number[]>(initialRawShares)

  const updatePeople = (next: number) => {
    const clamped = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, next))
    setPeople(clamped)
    setRawShares((prev) => resizeRawShares(prev, clamped))
  }

  const resetInputs = (peopleCount: number = DEFAULT_PEOPLE) => {
    setIngredient('')
    setRawTotal(0)
    setCookedTotal(0)
    setPeople(peopleCount)
    setMode('custom')
    setRawShares(initialRawShares())
  }

  const handleNew = () => {
    resetInputs()
  }

  const handleLoad = (id: string) => {
    const entry = history.find((e) => e.id === id)
    if (!entry) {
      return
    }
    setIngredient(entry.ingredient)
    setRawTotal(entry.rawTotal)
    setCookedTotal(entry.cookedTotal)
    setPeople(entry.people)
    setMode(entry.mode)
    setRawShares(
      entry.rawShares
        ? resizeRawShares(entry.rawShares, entry.people)
        : initialRawShares(),
    )
  }

  const handleSave = () => {
    if (rawTotal === 0 || cookedTotal === 0) {
      return
    }
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      ingredient,
      rawTotal,
      cookedTotal,
      people,
      mode,
      rawShares:
        mode === 'custom'
          ? Array.from({ length: people }, (_, i) => rawShares[i] ?? 0)
          : null,
      timestamp: Date.now(),
    }
    setHistory((prev) => [...prev, entry])
    resetInputs(people)
  }

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }

  const canSave = rawTotal !== 0 && cookedTotal !== 0

  return (
    <main className="min-h-svh w-full min-w-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex min-w-0 flex-col gap-5 py-4">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h1 className="min-w-0 text-xl font-semibold text-gray-900">
            Portion calculator
          </h1>
          <button
            type="button"
            className="min-h-10 shrink-0 rounded-md bg-[#0066FF] px-4 text-sm font-medium text-white hover:bg-[#0052CC]"
            onClick={handleNew}
          >
            New
          </button>
        </div>

        <section className="flex min-w-0 flex-col gap-4 rounded-2xl bg-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Totals</h2>

          <label className="flex min-w-0 flex-col gap-1 text-sm text-gray-600">
            Ingredient
            <input
              type="text"
              className="min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400"
              placeholder="(optional)"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </label>

          <div className="grid min-w-0 grid-cols-2 gap-3">
            <label className="flex min-w-0 flex-col gap-1 text-sm text-gray-600">
              Raw amount
              <input
                type="text"
                inputMode="decimal"
                className="min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-gray-900"
                value={rawTotal === 0 ? '' : String(rawTotal)}
                onChange={(e) => setRawTotal(parseDecimal(e.target.value))}
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-sm text-gray-600">
              Cooked amount
              <input
                type="text"
                inputMode="decimal"
                className="min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-gray-900"
                value={cookedTotal === 0 ? '' : String(cookedTotal)}
                onChange={(e) => setCookedTotal(parseDecimal(e.target.value))}
              />
            </label>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4 rounded-2xl bg-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Portions</h2>

          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="shrink-0 text-sm font-medium text-gray-700">People</span>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                disabled={people <= MIN_PEOPLE}
                aria-label="Decrease people"
                onClick={() => updatePeople(people - 1)}
              >
                −
              </button>
              <span className="min-w-8 text-center text-lg font-medium text-gray-900">
                {people}
              </span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                disabled={people >= MAX_PEOPLE}
                aria-label="Increase people"
                onClick={() => updatePeople(people + 1)}
              >
                +
              </button>
            </div>
          </div>

          <ModeToggle mode={mode} onChange={setMode} />

          <PeopleRows
            mode={mode}
            people={people}
            rawTotal={rawTotal}
            cookedTotal={cookedTotal}
            rawShares={rawShares}
            onSharesChange={setRawShares}
          />

          <button
            type="button"
            className="min-h-10 w-full rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canSave}
            onClick={handleSave}
          >
            Save to history
          </button>
        </section>

        <section className="min-w-0 rounded-2xl bg-gray-100 p-4">
          <HistoryList
            entries={history}
            onLoad={handleLoad}
            onDelete={handleDelete}
            onClearAll={() => setHistory([])}
          />
        </section>
      </div>
    </main>
  )
}
