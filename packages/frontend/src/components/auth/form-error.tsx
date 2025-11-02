import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

type Props = {
  message?: string
}

export const FormError = ({ message }: Props) => {
  if (!message) {
    return null
  }
  return (
    <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-sm">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
