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

export function equalPortionShares(
  rawTotal: number,
  cookedTotal: number,
  divisor: number,
): { rawShare: number; cookedShare: number } {
  if (!Number.isFinite(divisor) || divisor <= 0) {
    return { rawShare: 0, cookedShare: 0 }
  }
  const cookedShare = Number.isFinite(cookedTotal) ? cookedTotal / divisor : 0
  const rawShare =
    Number.isFinite(rawTotal) && rawTotal > 0 ? rawTotal / divisor : 0
  return { rawShare, cookedShare }
}

export interface HistoryPortion {
  index: number
  kind: 'person' | 'day'
  rawShare: number
  cooked: number
}

export function getHistoryPortions(entry: HistoryEntry): HistoryPortion[] {
  const { people, days, rawTotal, cookedTotal, mode, rawShares } = entry
  const dayCount = days > 0 ? days : 3

  if (mode === 'equal') {
    const { rawShare, cookedShare } = equalPortionShares(
      rawTotal,
      cookedTotal,
      dayCount,
    )
    return Array.from({ length: dayCount }, (_, i) => ({
      index: i + 1,
      kind: 'day' as const,
      rawShare,
      cooked: cookedShare,
    }))
  }

  return Array.from({ length: people }, (_, i) => {
    const rawShare = rawShares?.[i] ?? 0
    return {
      index: i + 1,
      kind: 'person' as const,
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
