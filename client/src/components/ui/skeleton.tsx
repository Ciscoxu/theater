import * as React from "react"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300 ${className || ""}`}
      {...props}
    />
  )
}

export { Skeleton }
