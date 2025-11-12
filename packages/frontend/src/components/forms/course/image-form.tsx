"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, PencilIcon, PlusCircleIcon, UploadIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { imageSchema, type ImageSchema } from "@/lib/validators/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { patchCourse } from "@/api/course"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDropzone } from "react-dropzone"
import { getUrl, uploadFiles, UploadSuccess } from "@/lib/upload-files"
import { deleteUpload } from "@/api/upload"
import { Image } from "@/components/optimized-image"

type Props = {
  initialData: Course
}

export const ImageForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<ImageSchema>({
    defaultValues: {
      imageUrl: initialData.imageUrl ?? "",
    },
    resolver: zodResolver(imageSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (payload: ImageSchema) => patchCourse(courseId, payload),
    onSuccess: ({ data }) => {
      console.log("data:", data)

      toast.success("Update course success", {
        description: `The course image updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateCourse(data)
  })

  const isDisabled = isSubmitting || isPending

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: isDisabled,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)

      const onUploadSuccess = ({ response }: UploadSuccess) => {
        const upload = response.data
        console.log("upload", upload)
        form.setValue("imageUrl", getUrl(upload))
      }

      await uploadFiles({
        files: acceptedFiles,
        onUploadSuccess,
      })
    },
  })

  const imageUrl = form.watch("imageUrl")

  const { mutate: removeUpload } = useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => {
      console.log("Image removed")

      form.setValue("imageUrl", "")
    },
    onError: () => {
      toast.error("Remove upload error", {
        description: "Something went wrong!",
      })
    },
  })

  const removeImageUrl = () => {
    if (imageUrl) {
      const uploadId = imageUrl.split("/").pop()
      if (uploadId) {
        removeUpload(uploadId)
      }
    } else {
      form.setValue("imageUrl", "")
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Course image</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.imageUrl ? (
            <>
              <PencilIcon className="mr-2 size-4" />
              Edit Image
            </>
          ) : (
            <>
              <PlusCircleIcon className="mr-2 size-4" />
              Add an Image
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <>
          <div
            {...getRootProps()}
            className={cn(
              `group border-muted-foreground/25 ring-offset-background focus-visible:ring-ring relative grid h-52 w-full
                cursor-pointer place-items-center rounded-lg border border-dashed bg-slate-200 px-5 py-2.5 text-center
                transition hover:bg-slate-200/25 focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:outline-hidden`,
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60"
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed border-slate-500 p-4">
                  <UploadIcon className="size-7 text-slate-500" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground font-medium">Drop the files here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed border-slate-500 p-4">
                  <UploadIcon className="size-7 text-slate-500" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-px">
                  <p className="text-muted-foreground font-medium">
                    Drag {`'n'`} drop 1 file here, or click to select a file
                  </p>
                  <p className="text-muted-foreground/70 text-sm">You can upload 1 file with a maximum size of 4MB</p>
                </div>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="my-4 flex items-start">
              <div className="group relative aspect-video">
                <div className="absolute top-1.5 right-1.5 bg-transparent">
                  <Button
                    variant="outline"
                    className="h-auto p-1 opacity-0 group-hover:opacity-100"
                    onClick={() => removeImageUrl()}
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <Image
                  src={imageUrl}
                  alt="Course image"
                  className="w-64 rounded-md object-cover"
                  width={120}
                  height={120}
                />
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input className="hidden" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>16:9 aspect ratio is recommended</FormDescription>
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
        </>
      ) : (
        <>
          {!initialData.imageUrl ? (
            <div
              className="flex h-60 items-center justify-center rounded-md border border-dashed border-slate-300
                bg-slate-200"
            >
              <div className="rounded-full border border-dashed border-slate-500 p-4">
                <ImageIcon className="size-7 text-slate-500" />
              </div>
            </div>
          ) : (
            <div className="relative aspect-video">
              <Image
                fill
                className="rounded-md object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Course image"
                src={initialData.imageUrl}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
