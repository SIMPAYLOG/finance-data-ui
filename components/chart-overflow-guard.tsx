"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ChartOverflowGuardProps {
  children: React.ReactNode
  className?: string
}

export function ChartOverflowGuard({ children, className }: ChartOverflowGuardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } = containerRef.current
        setIsOverflowing(scrollWidth > clientWidth || scrollHeight > clientHeight)
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [children])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        isOverflowing && "border-2 border-orange-200 bg-orange-50/20",
        className,
      )}
    >
      {isOverflowing && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">차트가 잘렸습니다</div>
        </div>
      )}
      <div className="w-full h-full">{children}</div>
    </div>
  )
}
