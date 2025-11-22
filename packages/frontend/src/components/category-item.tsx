"use client"

import type { Category } from "database/src/drizzle/schema/category"
import { HashIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type CategoryItemProps = {
  category: Category
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")

  return (
    <button
      type="button"
      className="flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium
        text-slate-700 transition hover:border-sky-700"
    >
      <HashIcon className="size-4 text-sky-700" />
      <span className="text-nowrap">{category.name}</span>
    </button>
  )
}
