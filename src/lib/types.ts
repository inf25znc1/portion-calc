export type PortionMode = 'equal' | 'custom'

export interface HistoryEntry {
  id: string
  ingredient: string
  rawTotal: number
  cookedTotal: number
  people: number
  days: number
  mode: PortionMode
  rawShares: number[] | null
  timestamp: number
}
