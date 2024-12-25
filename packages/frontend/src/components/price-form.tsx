"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { priceSchema, type PriceSchema } from "@/lib/validators/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "./ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { patchCourse } from "@/api/course"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/format-price"

type Props = {
  initialData: Course
}

export const PriceForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<PriceSchema>({
    defaultValues: {
      price: initialData.price ?? null,
    },
    resolver: zodResolver(priceSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const { toast } = useToast()

  const router = useRouter()

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (payload: PriceSchema) => patchCourse(courseId, payload),
    onSuccess: ({ data }) => {
      console.log("data:", data)
      const { price } = data

      const formattedPrice = price ? `'${formatPrice(price)}'` : ""

      toast({
        title: "Update course success",
        description: `The course price ${formattedPrice} was updated successfully`,
        variant: "green",
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast({
        title: "Update course error",
        description: "Something went wrong!",
        variant: "destructive",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateCourse(data)
  })

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Course price</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        className="pl-8"
                        placeholder="Course Price..."
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Price of this course</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting || !isValid || isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : initialData.price ? (
        <p className="mt-2 text-sm">{formatPrice(initialData.price)}</p>
      ) : (
        <p className="mt-2 text-sm italic text-slate-500">No price</p>
      )}
    </div>
  )
}
