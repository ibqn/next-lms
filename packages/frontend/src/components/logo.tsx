import Link from "next/link"
import type { ComponentProps } from "react"

type LogoProps = ComponentProps<"svg">

export const LogoIcon = (props: LogoProps) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 36" fill="none">
      <path
        opacity="1"
        d="M13.4525 0C9.85283 0 6.59018 1.82802 4.16824 4.81836H41.6634C43.5504 2.75056 45.8559 1.10806 48.4267 0H13.4525ZM1.41377 9.6069C0.686974 11.4522 0.198081 13.4878 0 15.6446H36.6631C36.9276 13.5501 37.5267 11.5116 38.4373 9.6069H1.41377ZM0.0440754 20.4332C0.283899 22.5986 0.817739 24.6349 1.59089 26.471H38.3645C37.4724 24.5632 36.8916 22.5247 36.6442 20.4332H0.0440754ZM4.53254 31.2596C6.91274 33.9917 10.0304 35.6434 13.4525 35.6434H47.182C45.0445 34.5394 43.127 33.0537 41.5241 31.2596H4.53254Z"
        fill="currentColor"
      />
      <path
        opacity="1"
        d="M48.2574 35.7382C58.0955 35.7382 66.0709 27.7629 66.0709 17.9247C66.0709 8.08657 58.0955 0.111176 48.2574 0.111176C38.4192 0.111176 30.4438 8.08657 30.4438 17.9247C30.4438 27.7629 38.4192 35.7382 48.2574 35.7382Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const Logo = () => {
  return (
    <Link href="/" className="group flex w-36 items-center text-sky-700">
      <LogoIcon className="h-8 w-full" />
      <span className="text-base font-bold uppercase transition-all group-hover:scale-105">zyfron</span>
      <span className="sr-only">zyfron</span>
    </Link>
  )
}
