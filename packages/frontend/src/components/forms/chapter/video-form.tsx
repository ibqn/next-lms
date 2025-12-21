"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { PencilIcon, PlusCircleIcon, UploadIcon, VideoIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { videoSchema, VideoSchema } from "@/lib/validators/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDropzone } from "react-dropzone"
import { getUrl, uploadFiles, UploadSuccess } from "@/lib/upload-files"
import { deleteUpload } from "@/api/upload"
import { dashboardChapterQueryOptions, patchChapter } from "@/api/chapter"
import { VideoPlayer } from "@/components/video"

type Props = {
  initialData: Chapter
}

export const VideoForm = ({ initialData }: Props) => {
  const { id: chapterId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<VideoSchema>({
    defaultValues: {
      videoUrl: initialData.videoUrl ?? "",
    },
    resolver: zodResolver(videoSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: (payload: VideoSchema) => patchChapter(chapterId, payload),
    onSuccess: (data) => {
      console.log("data:", data)

      toast.success("Update chapter success", {
        description: `The chapter video updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Update chapter error", {
        description: "Something went wrong!",
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: dashboardChapterQueryOptions({ id: chapterId }).queryKey,
      })
      router.refresh()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateChapter(data)
  })

  const isDisabled = isSubmitting || isPending

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: isDisabled,
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
    accept: {
      "video/*": [],
    },
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)

      const onUploadSuccess = ({ response }: UploadSuccess) => {
        const upload = response.data
        console.log("upload", upload)
        form.setValue("videoUrl", getUrl(upload))
      }

      await uploadFiles({
        files: acceptedFiles,
        onUploadSuccess,
      })
    },
  })

  const videoUrl = form.watch("videoUrl")

  const { mutate: removeUpload } = useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => {
      console.log("Video removed")

      form.setValue("videoUrl", "")
    },
    onError: () => {
      toast.error("Remove upload error", {
        description: "Something went wrong!",
      })
    },
  })

  const removeVideoUrl = () => {
    if (videoUrl) {
      const uploadId = videoUrl.split("/").pop()
      if (uploadId) {
        removeUpload(uploadId)
      }
    } else {
      form.setValue("videoUrl", "")
    }
  }

  const videoPlayerOptions = useMemo(
    () => ({
      responsive: true,
      autoplay: false,
      sources: [{ src: videoUrl, type: "video/mp4" }],
    }),
    [videoUrl]
  )

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter video</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.videoUrl ? (
            <>
              <PencilIcon className="mr-2 size-4" />
              Edit Video
            </>
          ) : (
            <>
              <PlusCircleIcon className="mr-2 size-4" />
              Add a Video
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
                <p className="text-muted-foreground font-medium">Drop a video file here</p>
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
                  <p className="text-muted-foreground/70 text-sm">You can upload 1 file with a maximum size of 500MB</p>
                </div>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="my-4 flex items-start">
              <div className="group relative block w-full">
                <div className="absolute top-1.5 right-1.5 z-30 bg-transparent">
                  <Button
                    variant="outline"
                    className="h-auto p-1 opacity-0 group-hover:opacity-100"
                    onClick={() => removeVideoUrl()}
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <VideoPlayer options={videoPlayerOptions} />
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input className="hidden" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>{"Upload this chapter's video"}</FormDescription>
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
          {!initialData.videoUrl ? (
            <div
              className="flex h-60 items-center justify-center rounded-md border border-dashed border-slate-300
                bg-slate-200"
            >
              <div className="rounded-full border border-dashed border-slate-500 p-4">
                <VideoIcon className="size-7 text-slate-500" />
              </div>
            </div>
          ) : (
            <>
              <div className="block w-full">
                <VideoPlayer options={videoPlayerOptions} />
              </div>
              <div className="text-muted-foreground mt-2 text-sm">
                Video might take a few minutes to process after upload.
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
