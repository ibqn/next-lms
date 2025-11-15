import { cva, VariantProps } from "class-variance-authority"
import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react"

const bannerVariants = cva("border text-center p-4 text-sm flex items-center w-full", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-300 text-primary",
      success: "bg-emerald-700 border-emerald-800 text-secondary",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
})

const iconMap = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
} as const

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant ?? "warning"]

  return (
    <div className={bannerVariants({ variant })}>
      {Icon && <Icon className="mr-2 size-4" />}
      {label}
    </div>
  )
}
