import type { LucideIcon } from "lucide-react"
import { IconBadge } from "./icon-badge"
import type { ComponentProps } from "react"

type InfoCardProps = {
  icon: LucideIcon
  label: string
  value: number | string
  variant?: ComponentProps<typeof IconBadge>["variant"]
}

export const InfoCard = ({ icon: Icon, label, value, variant }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className="text-sm leading-6 font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}
