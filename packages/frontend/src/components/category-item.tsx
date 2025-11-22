"use client"

import { cn } from "@/lib/utils"
import type { Category } from "database/src/drizzle/schema/category"
import { HashIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"

type CategoryItemProps = {
  category: Category
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")
  const currentTitle = searchParams.get("title")

  const isSelected = currentCategory === category.name.toLowerCase()

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          category: isSelected ? null : category.name.toLowerCase(),
          title: currentTitle,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        `flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700
        transition hover:border-sky-700`,
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
    >
      <HashIcon className="size-4 text-sky-700" />
      <span className="text-nowrap">{category.name}</span>
    </button>
  )
}
