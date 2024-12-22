import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden"
import type { ComponentProps } from "react"

export const VisuallyHidden = (props: ComponentProps<typeof VisuallyHiddenPrimitive.Root>) => (
  <VisuallyHiddenPrimitive.Root {...props} />
)
