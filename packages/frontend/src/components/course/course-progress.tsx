import { cva, VariantProps } from "class-variance-authority"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const courseProgressVariants = cva("h-2", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "text-sm",
      sm: "text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type CourseProgressVariantsProps = VariantProps<typeof courseProgressVariants>

type CourseProgress = {
  value: number
} & CourseProgressVariantsProps

export const CourseProgress = ({ value, variant, size }: CourseProgress) => {
  return (
    <div>
      <Progress value={value} className={courseProgressVariants({ variant, size })} />
      <p className={cn("mt-2 font-medium text-sky-700", courseProgressVariants({ size }))}>
        {Math.round(value)}% Completed
      </p>
    </div>
  )
}
