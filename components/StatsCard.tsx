interface StatsCardProps {
  label: string
  value: string
  sublabel?: string
  accent?: 'orange' | 'blue' | 'yellow' | 'cream'
}

const accentBorders: Record<string, string> = {
  orange: 'border-l-lfg-orange',
  blue: 'border-l-lfg-blue',
  yellow: 'border-l-lfg-yellow',
  cream: 'border-l-lfg-cream',
}

export default function StatsCard({
  label,
  value,
  sublabel,
  accent = 'orange',
}: StatsCardProps) {
  return (
    <div
      className={`stat-card border-l-4 ${accentBorders[accent]}`}
    >
      <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-3xl font-octarine text-lfg-black lowercase">
        {value}
      </p>
      {sublabel && (
        <p className="text-xs font-dm text-gray-400 mt-1">{sublabel}</p>
      )}
    </div>
  )
}
