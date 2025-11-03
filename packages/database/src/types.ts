export type SuccessResponse<T = void> = {
  success: true
  message: string
  data: T
}

export type ErrorResponse<E = string> = {
  success: false
  error: E
}

export type ApiResponse<T = void, E = string> =
  | SuccessResponse<T>
  | ErrorResponse<E>

export type PaginatedSuccessResponse<T> = SuccessResponse<T> & {
  pagination: {
    page: number
    totalPages: number
    totalItems: number
  }
}

export const response = <T = void>(
  message: string,
  value?: T
): SuccessResponse<T> => ({
  success: true,
  message,
  data: value as T,
})

export const error = <E>(error: E): ErrorResponse<E> => ({
  success: false,
  error,
})
