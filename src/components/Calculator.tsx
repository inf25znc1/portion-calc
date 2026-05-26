import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { HistoryEntry, PortionMode } from '../lib/types'
import { ModeToggle } from './ModeToggle'
import { StepperControl } from './StepperControl'
import { PeopleRows } from './PeopleRows'
import { HistoryList } from './HistoryList'

const HISTORY_KEY = 'portion-calc-history'
const DEFAULT_PEOPLE = 2
const DEFAULT_DAYS = 3
const MIN_PEOPLE = 1
const MAX_PEOPLE = 20
const MIN_DAYS = 1
const MAX_DAYS = 20

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
  const [days, setDays] = useState(DEFAULT_DAYS)
  const [mode, setMode] = useState<PortionMode>('custom')
  const [rawShares, setRawShares] = useState<number[]>(initialRawShares)

  const updatePeople = (next: number) => {
    const clamped = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, next))
    setPeople(clamped)
    setRawShares((prev) => resizeRawShares(prev, clamped))
  }

  const updateDays = (next: number) => {
    const clamped = Math.min(MAX_DAYS, Math.max(MIN_DAYS, next))
    setDays(clamped)
  }

  const resetInputs = (
    peopleCount: number = DEFAULT_PEOPLE,
    daysCount: number = DEFAULT_DAYS,
  ) => {
    setIngredient('')
    setRawTotal(0)
    setCookedTotal(0)
    setPeople(peopleCount)
    setDays(daysCount)
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
    setDays(entry.days > 0 ? entry.days : DEFAULT_DAYS)
    setMode(entry.mode)
    setRawShares(
      entry.rawShares
        ? resizeRawShares(entry.rawShares, entry.people)
        : initialRawShares(),
    )
  }

  const canSave =
    cookedTotal !== 0 && (mode === 'equal' || rawTotal !== 0)

  const handleSave = () => {
    if (!canSave) {
      return
    }
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      ingredient,
      rawTotal,
      cookedTotal,
      people,
      days,
      mode,
      rawShares:
        mode === 'custom'
          ? Array.from({ length: people }, (_, i) => rawShares[i] ?? 0)
          : null,
      timestamp: Date.now(),
    }
    setHistory((prev) => [...prev, entry])
    resetInputs(people, days)
  }

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }

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
              Raw amount{mode === 'equal' ? ' (optional)' : ''}
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

          <StepperControl
            label="People"
            value={people}
            min={MIN_PEOPLE}
            max={MAX_PEOPLE}
            decreaseLabel="Decrease people"
            increaseLabel="Increase people"
            onChange={updatePeople}
          />

          <ModeToggle mode={mode} onChange={setMode} />

          {mode === 'equal' && (
            <StepperControl
              label="Days"
              value={days}
              min={MIN_DAYS}
              max={MAX_DAYS}
              decreaseLabel="Decrease days"
              increaseLabel="Increase days"
              onChange={updateDays}
            />
          )}

          <PeopleRows
            mode={mode}
            people={people}
            days={days}
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
