"use client"

import { useEffect, useMemo, useRef } from "react"
import videojs from "video.js"

import "video.js/dist/video-js.css"

type VideoPlayerOptions = Parameters<typeof videojs>[1]
type VideoPlayer = ReturnType<typeof videojs>

type VideoPlayerProps = {
  options: VideoPlayerOptions
  onReady?: (player: VideoPlayer) => void
}

const initialOptions: VideoPlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
}

export const VideoPlayer = ({ options, onReady }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<VideoPlayer>(null)

  const mergedOptions = useMemo(() => ({ ...initialOptions, ...options }), [options])

  console.log("mergedOptions", mergedOptions)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js")

      videoElement.classList.add("vjs-big-play-centered")
      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, mergedOptions, () => {
        videojs.log("player is ready")
        onReady?.(player)
      }))
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef, onReady, mergedOptions])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  )
}
