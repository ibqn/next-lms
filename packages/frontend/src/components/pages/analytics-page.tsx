"use client"

import { editorAnalyticsQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DataCard } from "@/components/data-card"
import type { AnalyticsData } from "database/src/queries/analytics"
import { formatPrice } from "@/lib/format-price"
import { DataChart } from "@/components/data-chart"

export const AnalyticsPage = () => {
  const { data: analyticsData } = useSuspenseQuery(editorAnalyticsQueryOptions())

  const { totalSalesCount = 0, totalEarnings = 0, data = [] } = analyticsData ?? ({} as AnalyticsData)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard label="Total Revenue" value={formatPrice(totalEarnings)} />
        <DataCard label="Total Sales" value={totalSalesCount} />
      </div>

      <DataChart data={data} />
    </div>
  )
}
