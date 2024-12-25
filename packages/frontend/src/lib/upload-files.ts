import { AxiosProgressEvent } from "axios"
import { axios } from "../api/axios"
import { SuccessResponse } from "backend/src/types"
import { Upload } from "database/src/drizzle/schema/upload"

export type UploadProgress = {
  file: File
  progress: number
}

export type UploadSuccess = {
  file: File
  response: SuccessResponse<Upload>
}

export type UploadError = {
  file: File
  error: Error
}

type UploadOptions = {
  files: File[]

  onUploadProgress?: ({ file, progress }: UploadProgress) => void
  onUploadSuccess?: ({ file, response }: UploadSuccess) => void
  onUploadError?: ({ file, error }: UploadError) => void
}

export const uploadFiles = async ({ files, onUploadProgress, onUploadSuccess, onUploadError }: UploadOptions) => {
  const uploadProgressForFile = (file: File) => (progressEvent: AxiosProgressEvent) => {
    const { loaded, total } = progressEvent
    const progress = total ? Math.floor((loaded / total) * 100) : 0
    onUploadProgress?.({ file, progress })
  }

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axios.post<SuccessResponse<Upload>>("/uploads", formData, {
      ...config,
      onUploadProgress: uploadProgressForFile(file),
    })

    return response.data
  }

  const responses = await Promise.all(
    files.map(async (file) => {
      try {
        const response = await uploadFile(file)
        onUploadSuccess?.({ file, response })
        return response
      } catch (error) {
        if (error instanceof Error) {
          onUploadError?.({ file, error })
        }
      }
    })
  )

  return responses
}

export const getPublicUrl = (upload: Upload) => {
  if (!upload.isPublic) {
    return null
  }
  return `/uploads/${upload.id}/public`
}

export const getProtectedUrl = (upload: Upload) => {
  // return `http://localhost:3333/uploads/${upload.id}/protected`
  // return `/uploads/${upload.id}/protected`
  return `/images/${upload.id}`
}
