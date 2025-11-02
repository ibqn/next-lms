import { KeySquare } from "lucide-react"

type Props = {
  label: string
}

export const Header = ({ label }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <div className="flex flex-row gap-x-2">
        <KeySquare size={30} />
        <h1 className="text-3xl font-semibold">LMS</h1>
      </div>

      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}
