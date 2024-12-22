import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function AuthLayout({ children }: Props) {
  return <div className="flex grow items-center justify-center">{children}</div>
}
