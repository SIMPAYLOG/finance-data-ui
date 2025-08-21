"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveChartContainerProps {
  children: React.ReactNode
  className?: string
  minHeight?: number
  maxHeight?: number
  aspectRatio?: number
}

export function ResponsiveChartContainer({
  children,
  className,
  minHeight = 250,
  maxHeight = 500,
  aspectRatio = 16 / 9,
}: ResponsiveChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        const calculatedHeight = Math.min(Math.max(width / aspectRatio, minHeight), maxHeight)
        setDimensions({ width, height: calculatedHeight })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [aspectRatio, minHeight, maxHeight])

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden", className)}
      style={{ height: dimensions.height || minHeight }}
    >
      <div className="w-full h-full relative">{children}</div>
    </div>
  )
}
