import type { ImageLoaderProps } from "next/image"
import { env } from "@/lib/env"

const API_BASE_URL = env.NEXT_PUBLIC_API_URL

export function customImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const uploadId = src.split("/").pop()?.split("?")[0]

  if (!uploadId) {
    throw new Error(`Invalid image src: ${src}. Unable to extract uploadId.`)
  }

  const params = new URLSearchParams()

  if (width) {
    params.set("w", width.toString())
  }

  if (quality) {
    params.set("q", quality.toString())
  }

  params.set("format", "webp")

  const queryString = params.toString()
  const url = `${API_BASE_URL}/uploads/${uploadId}?${queryString}`

  return url
}
