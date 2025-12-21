import { Loader2Icon, LockIcon } from "lucide-react"
import { useMemo } from "react"
import { VideoPlayer } from "@/components/video"

type CourseVideoPlayerProps = {
  isLocked: boolean
  videoUrl: string | null
}

export const CourseVideoPlayer = ({ isLocked, videoUrl }: CourseVideoPlayerProps) => {
  const videoPlayerOptions = useMemo(
    () =>
      videoUrl
        ? {
            responsive: true,
            autoplay: false,
            sources: [{ src: videoUrl, type: "video/mp4" }],
          }
        : null,
    [videoUrl]
  )

  return (
    <div className="relative">
      {!isLocked && !videoPlayerOptions && (
        <div className="absolute inset-0 flex aspect-video items-center justify-center bg-slate-800">
          <Loader2Icon className="text-secondary size-8 animate-spin" />
        </div>
      )}
      {isLocked && (
        <div
          className="text-secondary absolute inset-0 flex aspect-video items-center justify-center gap-y-2 bg-slate-800"
        >
          <LockIcon className="size-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {videoPlayerOptions && (
        <div className="block">
          <VideoPlayer options={videoPlayerOptions} />
        </div>
      )}
    </div>
  )
}
