import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type HeadingProps = ComponentProps<"div">

export const Heading = ({ children, className, ...props }: HeadingProps) => {
  return (
    <div
      {...props}
      className={cn("text-muted-foreground text-xs leading-tight font-semibold tracking-tight capitalize", className)}
    >
      {children}
    </div>
  )
}
