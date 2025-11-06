"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"
import { type ReactNode, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

type Props = Readonly<{
  children: ReactNode
}>

export function Providers({ children }: Props) {
  const [queryClient] = useState(getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
