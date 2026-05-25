import type { HistoryEntry } from './types'

export function computeCooked(
  rawShare: number,
  rawTotal: number,
  cookedTotal: number,
): number {
  if (
    !Number.isFinite(rawShare) ||
    !Number.isFinite(rawTotal) ||
    !Number.isFinite(cookedTotal) ||
    rawTotal <= 0
  ) {
    return 0
  }
  return (rawShare / rawTotal) * cookedTotal
}

export interface HistoryPortion {
  personIndex: number
  rawShare: number
  cooked: number
}

export function getHistoryPortions(entry: HistoryEntry): HistoryPortion[] {
  const { people, rawTotal, cookedTotal, mode, rawShares } = entry
  return Array.from({ length: people }, (_, i) => {
    const rawShare =
      mode === 'equal'
        ? people > 0
          ? rawTotal / people
          : 0
        : (rawShares?.[i] ?? 0)
    return {
      personIndex: i + 1,
      rawShare,
      cooked: computeCooked(rawShare, rawTotal, cookedTotal),
    }
  })
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n) || n === 0) {
    return '—'
  }
  return String(Math.round(n * 10) / 10)
}
