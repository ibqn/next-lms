"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"
import { ReactNode, useState } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export function Providers({ children }: Props) {
  const [queryClient] = useState(getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
