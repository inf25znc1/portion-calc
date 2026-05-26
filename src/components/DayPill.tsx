interface DayPillProps {
  dayIndex: number
}

export function DayPill({ dayIndex }: DayPillProps) {
  return (
    <span className="shrink-0 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
      Day {dayIndex}
    </span>
  )
}
