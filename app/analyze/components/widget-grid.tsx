"use client"

import { useState } from "react"
import { useDrop } from "react-dnd"
import DraggableWidget from "./draggable-widget"
import HeatmapChart from "./charts/heatmap-chart"
import MonthlyComparisonChart from "./charts/monthly-comparison-chart"
import DailyComparisonChart from "./charts/daily-comparison-chart"
import WeeklyComparisonChart from "./charts/weekly-comparison-chart"
import BalanceTrendChart from "./charts/balance-trend-chart"
import CategoryPieChart from "./charts/category-pie-chart"
import CollectiveComparisonChart from "./charts/collective-comparison-chart"
import TopCategoriesChart from "./charts/top-categories-chart"
import HourlyAmountAverageChart from "./charts/hourly-amount-average-chart"
import WidgetSelector from "./widget-selector"
import ChartEditModal from "./chart-edit-modal"

interface WidgetGridProps {
  isEditMode: boolean
  filters: any
  analysisMode: "individual" | "collective"
  isLoading: boolean
}

export default function WidgetGrid({ isEditMode, filters, analysisMode, isLoading }: WidgetGridProps) {
  const [widgets, setWidgets] = useState([
    { id: "monthly-comparison", type: "monthly-comparison", position: { x: 0, y: 0 }, size: { w: 2, h: 1 } },
    { id: "balance-trend", type: "balance-trend", position: { x: 2, y: 0 }, size: { w: 2, h: 1 } },
    { id: "category-pie", type: "category-pie", position: { x: 0, y: 1 }, size: { w: 1, h: 1 } },
    { id: "collective-comparison", type: "collective-comparison", position: { x: 1, y: 1 }, size: { w: 2, h: 1 } },
    { id: "top-categories", type: "top-categories", position: { x: 3, y: 1 }, size: { w: 1, h: 1 } },
    { id: "daily-comparison", type: "daily-comparison", position: { x: 0, y: 2 }, size: { w: 2, h: 1 } },
    { id: "weekly-comparison", type: "weekly-comparison", position: { x: 2, y: 1 }, size: { w: 2, h: 1 } },
    { id: "heatmap-chart", type: "heatmap-chart", position: { x: 2, y: 2 }, size: { w: 2, h: 1 } },
    { id: "hourly-amount-average", type: "hourly-amount-average", position: { x: 0, y: 0 }, size: { w: 2, h: 1 } },
  ])

  const [editingWidget, setEditingWidget] = useState<string | null>(null)

  const [{ isOver }, drop] = useDrop({
    accept: "widget",
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (delta) {
        moveWidget(item.id, delta.x, delta.y)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const moveWidget = (id: string, deltaX: number, deltaY: number) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id
          ? {
              ...widget,
              position: {
                x: Math.max(0, widget.position.x + Math.round(deltaX / 100)),
                y: Math.max(0, widget.position.y + Math.round(deltaY / 100)),
              },
            }
          : widget,
      ),
    )
  }

  const addWidget = (type: string) => {
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 0, y: Math.max(...widgets.map((w) => w.position.y + w.size.h)) },
      size: { w: 2, h: 1 },
    }
    setWidgets((prev) => [...prev, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id))
  }

  const editWidget = (id: string) => {
    setEditingWidget(id)
  }

  const renderWidget = (widget: any) => {
    const commonProps = {
      filters,
      isEditMode,
      analysisMode,
      isLoading,
      onRemove: () => removeWidget(widget.id),
      onEdit: () => editWidget(widget.id),
    }

    switch (widget.type) {
      case "heatmap-chart":
        return <HeatmapChart {...commonProps}/>
      case "weekly-comparison":
        return <WeeklyComparisonChart {...commonProps}/>
      case "daily-comparison":
        return <DailyComparisonChart {...commonProps} />
      case "monthly-comparison":
        return <MonthlyComparisonChart {...commonProps} />
      case "balance-trend":
        return <BalanceTrendChart {...commonProps} />
      case "category-pie":
        return <CategoryPieChart {...commonProps} />
      case "collective-comparison":
        return <CollectiveComparisonChart {...commonProps} />
      case "top-categories":
        return <TopCategoriesChart {...commonProps} />
      case "hourly-amount-average":
        return <HourlyAmountAverageChart {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div ref={drop as unknown as React.LegacyRef<HTMLDivElement>} className="relative">
      {isEditMode && <WidgetSelector onAddWidget={addWidget} />}

      <div className="grid grid-cols-4 gap-6 auto-rows-fr">
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            isEditMode={isEditMode}
            className={`col-span-${widget.size.w} row-span-${widget.size.h}`}
          >
            {renderWidget(widget)}
          </DraggableWidget>
        ))}
      </div>

      {/* Chart Edit Modal */}
      {editingWidget && (
        <ChartEditModal
          widgetId={editingWidget}
          onClose={() => setEditingWidget(null)}
          onSave={(config) => {
            console.log("Chart config saved:", config)
            setEditingWidget(null)
          }}
        />
      )}
    </div>
  )
}
