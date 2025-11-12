import { env } from "@/lib/env"
import axios from "axios"

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params

  const cookies = request.headers.get("cookie")

  const response = await axios.get(`${env.NEXT_PUBLIC_API_URL}/uploads/${id}`, {
    withCredentials: true,
    headers: {
      Cookie: cookies,
    },
  })

  return new Response(response.data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
    },
  })
}
