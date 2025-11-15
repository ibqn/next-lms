"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, PencilIcon, PlusCircleIcon, UploadIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDropzone } from "react-dropzone"
import { getUrl, uploadFiles, UploadSuccess } from "@/lib/upload-files"
import { deleteUpload } from "@/api/upload"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { attachmentSchema, AttachmentSchema } from "@/lib/validators/course"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import Link from "next/link"
import { postAttachment } from "@/api/attachment"

type Props = {
  initialData: Course
}

export const FileForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const router = useRouter()

  const { mutate: createAttachment, isPending } = useMutation({
    mutationFn: postAttachment,
    onSuccess: ({ data }) => {
      console.log("data:", data)

      toast("Create attachment success", {
        description: `The course image updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Create attachment error", {
        description: "Something went wrong!",
      })
    },
  })

  const isDisabled = isPending

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: isDisabled,
    maxSize: 4 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)

      const onUploadSuccess = ({ response }: UploadSuccess) => {
        const upload = response.data
        console.log("upload", upload)
        addAttachment({
          name: upload.filePath,
          url: getUrl(upload),
        })
      }

      await uploadFiles({
        files: acceptedFiles,
        onUploadSuccess,
      })
    },
  })

  const { mutate: removeUpload } = useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => {
      console.log("Upload removed")
    },
    onError: () => {
      toast.error("Remove upload error", {
        description: "Something went wrong!",
      })
    },
  })

  const form = useForm<AttachmentSchema>({
    defaultValues: {
      attachments: initialData.attachments ?? [],
    },
    resolver: zodResolver(attachmentSchema),
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    const attachments = data.attachments.map((attachment) => ({
      ...attachment,
      courseId,
    }))
    createAttachment(attachments)
  })

  const {
    append: addAttachment,
    remove: removeAttachment,
    fields: attachmentFields,
  } = useFieldArray({
    control: form.control,
    name: "attachments",
  })

  const { isSubmitting, isValid } = form.formState

  return (
    <div className="rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Course attachments</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.attachments && initialData.attachments.length > 0 ? (
            <>
              <PencilIcon className="mr-2 size-4" />
              Edit files
            </>
          ) : (
            <>
              <PlusCircleIcon className="mr-2 size-4" />
              Add files
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
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className="text-muted-foreground/70 text-sm">You can upload files with a maximum size of 4MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-muted-foreground mt-2 text-sm">
              Add anything your students might need to complete the course.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              {attachmentFields.map((field, index) => (
                <div
                  key={field.url}
                  className="flex items-center gap-2 rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <FileIcon className="size-4 shrink-0" />
                  <div className="grow">
                    <FormField
                      control={form.control}
                      name={`attachments.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Link className="line-clamp-1 text-xs" target="_blank" href={field.value.url}>
                              {field.value.name}{" "}
                            </Link>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="size-8"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeAttachment(index)
                    }}
                    disabled={isDisabled}
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}

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
          {initialData.attachments && initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm text-slate-500 italic">No Attachments</p>
          )}
        </>
      )}
    </div>
  )
}
