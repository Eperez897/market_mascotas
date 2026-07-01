import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change: number
  icon: LucideIcon
  color: 'amber' | 'green' | 'blue' | 'rose'
}

const colorMap = {
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  blue: {
    bg: 'bg-sky-50',
    icon: 'text-sky-600',
    iconBg: 'bg-sky-100',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
}

export function StatCard({ label, value, change, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color]
  const positive = change >= 0

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg ${c.iconBg} flex items-center justify-center`}>
          <Icon size={17} className={c.icon} />
        </div>
        <span className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full
          ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {positive
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />
          }
          {positive ? '+' : ''}{change}%
        </span>
      </div>
      <div>
        <p className="text-[24px] font-semibold text-stone-800 leading-none">{value}</p>
        <p className="text-[13px] text-stone-400 mt-1">{label}</p>
      </div>
    </div>
  )
}
