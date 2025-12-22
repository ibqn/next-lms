import { AnalyticsChartData } from "database/src/queries/analytics"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { formatPrice } from "@/lib/format-price"

type DataChartProps = {
  data: AnalyticsChartData[]
}

export const DataChart = ({ data }: DataChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} dataKey="courseTitle">
          <XAxis dataKey="courseTitle" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Bar dataKey="earnings" fill="#0369a1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
