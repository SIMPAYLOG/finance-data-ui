import type { ReactNode } from "react"
import { useDrag } from "react-dnd"

interface DraggableWidgetProps {
  id: string
  children: ReactNode
  isEditMode: boolean
  className?: string
}

export default function DraggableWidget({ id, children, isEditMode, className }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "widget",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode,
  })

  return (
    <div
      ref={drag}
      className={`${className} ${isDragging ? "opacity-50" : ""} ${
        isEditMode ? "cursor-move border-2 border-dashed border-primary" : ""
      }`}
    >
      {children}
    </div>
  )
}
