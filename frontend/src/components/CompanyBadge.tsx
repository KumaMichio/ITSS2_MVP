interface Props {
  logo: string
  logoColor: string
  size?: number
}

export default function CompanyBadge({ logo, logoColor, size = 44 }: Props) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: logoColor, fontSize: size * 0.35 }}
    >
      {logo}
    </div>
  )
}
