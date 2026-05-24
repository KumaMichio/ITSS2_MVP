import { matchColor } from '../lib/utils'

interface Props {
  value: number
  size?: number
}

export default function MatchCircle({ value, size = 56 }: Props) {
  const r = (size - 6) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const { stroke, text } = matchColor(value)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute text-xs font-bold ${text}`} style={{ fontSize: size * 0.22 }}>
        {value}%
      </span>
    </div>
  )
}
