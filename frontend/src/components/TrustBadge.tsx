import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react'
import { trustColor } from '../lib/utils'

interface Props {
  score: number
  size?: 'sm' | 'md'
}

export default function TrustBadge({ score, size = 'md' }: Props) {
  const colorClass = trustColor(score)
  const Icon = score >= 85 ? ShieldCheck : score >= 70 ? Shield : ShieldAlert
  const iconSize = size === 'sm' ? 13 : 15

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${colorClass}`}
    >
      <Icon size={iconSize} />
      Trust {score}
    </span>
  )
}
