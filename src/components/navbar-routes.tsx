import { UserButton } from "@/components/user-button"

type Props = {}

export const NavbarRoutes = (props: Props) => {
  return (
    <div className="ml-auto flex gap-x-2">
      <UserButton />
    </div>
  )
}
