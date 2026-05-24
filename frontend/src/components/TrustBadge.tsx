import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react'
import { trustColor } from '../lib/utils'

interface Props {
  score: number
  size?: 'sm' | 'md'
}

export default function TrustBadge({ score, size = 'md' }: Props) {
  const colorClass = trustColor(score)
  const Icon = score >= 85 ? ShieldCheck : score >= 70 ? Shield : ShieldAlert
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
    >
      <Icon size={iconSize} />
      Trust {score}
    </span>
  )
}
