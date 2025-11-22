"use client"

import { SearchIcon } from "lucide-react"
import { useEffect, useState, type ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

type Props = ComponentProps<"div">

export const SearchInput = ({ className, ...props }: Props) => {
  const [value, setValue] = useState("")

  const debouncedValue = useDebounce(value)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentCategory = searchParams.get("category")

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          category: currentCategory,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }, [debouncedValue, currentCategory, pathname, router])

  return (
    <div {...props} className={cn("relative", className)}>
      <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-600" />
      <Input
        type="text"
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        placeholder="Search for a course..."
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
      />
    </div>
  )
}
