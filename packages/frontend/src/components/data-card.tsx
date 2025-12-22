import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DataCardProps = {
  label: string
  value: string | number
}

export const DataCard = ({ label, value }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-secondary-foreground text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
