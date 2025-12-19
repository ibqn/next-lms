"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"
import { Loader2Icon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type CourseEnrollButtonProps = {
  courseId?: Course["id"]
  price?: Course["price"]
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const isValidPrice = useMemo(() => typeof price === "number" && price > 0, [price])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Button size="sm" className="w-full md:w-auto">
      {isValidPrice ? <span>Enroll for {formatPrice(price!)}</span> : <Loader2Icon className="size-4 animate-spin" />}
    </Button>
  )
}
