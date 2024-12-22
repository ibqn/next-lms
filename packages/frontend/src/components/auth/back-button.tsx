import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {
  href: string
  children: React.ReactNode
}

export const BackButton = ({ href, children }: Props) => {
  return (
    <Button asChild variant="link" className="w-full font-normal" size="sm">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
