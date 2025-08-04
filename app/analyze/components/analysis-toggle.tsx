"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"

interface AnalysisToggleProps {
  mode: "individual" | "collective"
  onModeChange: (mode: "individual" | "collective") => void
}

export default function AnalysisToggle({ mode, onModeChange }: AnalysisToggleProps) {
  return (
    <Card className="mx-6 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">분석 모드:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={mode === "individual" ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange("individual")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              개인 분석
            </Button>
            <Button
              variant={mode === "collective" ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange("collective")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              집단 분석
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">{mode === "collective" && "최대 10,000명 데이터 분석"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
