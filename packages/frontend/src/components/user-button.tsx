"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getSignout } from "@/api/auth"
import { useRouter } from "next/navigation"

export const UserButton = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: signout } = useMutation({
    mutationFn: getSignout,
    onSettled: async () => {
      queryClient.setQueryData(["user"], null)
    },
  })

  const handleSignOut = () => {
    console.log("Sign out")
    signout()
    router.push("/sign-in")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={undefined} />
          <AvatarFallback className="bg-gradient-120 from-indigo-6 to-cyan-3">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
