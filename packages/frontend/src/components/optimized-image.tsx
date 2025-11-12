import { type ImageProps } from "next/image"
import NextImage from "next/image"
import { customImageLoader } from "@/lib/image-loader"

export const Image = (props: ImageProps) => {
  return <NextImage loader={customImageLoader} {...props} />
}
