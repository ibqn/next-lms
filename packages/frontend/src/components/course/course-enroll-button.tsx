"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"
import { Loader2Icon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { postCheckout } from "@/api/checkout"

type CourseEnrollButtonProps = {
  courseId?: Course["id"]
  price?: Course["price"]
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const isReady = useMemo(() => typeof price === "number" && price > 0 && !!courseId, [price, courseId])
  const [isClient, setIsClient] = useState(false)

  const { mutate: purchaseCourse, isPending } = useMutation({
    mutationFn: postCheckout,
    onSuccess: (data) => {
      if (data) {
        window.location.assign(data.url)
      }
    },
    onError: () => {
      console.log("Error during purchase")
    },
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Button
      size="sm"
      className="w-full md:w-auto"
      disabled={!isReady || isPending}
      onClick={() => purchaseCourse({ id: courseId! })}
    >
      {isReady && !isPending ? (
        <span>Enroll for {formatPrice(price!)}</span>
      ) : (
        <Loader2Icon className="size-4 animate-spin" />
      )}
      {isPending && <span className="ml-2">Processing...</span>}
    </Button>
  )
}
