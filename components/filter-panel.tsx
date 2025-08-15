"use client"

import { useState } from "react"
import { Filter, Calendar, Users, Briefcase, DollarSign, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useFilters } from "@/components/filter-provider"
import { cn } from "@/lib/utils"

export function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { filters, updateFilters, resetFilters } = useFilters()

  const spendingTypes = ["소비지향형", "저축지향형", "무계획형", "균형형"]
  const ageGroups = ["20대", "30대", "40대", "50대+"]
  const occupations = ["회사원", "자영업", "프리랜서", "학생", "공무원", "기타"]

  const getActiveFiltersCount = () => {
    return (
      filters.spendingTypes.length +
      filters.ageGroups.length +
      filters.occupations.length +
      filters.incomeDeciles.length
    )
  }

  return (
    <div className={cn("transition-all duration-300 border-l bg-background", isExpanded ? "w-80" : "w-12")}>
      <div className="p-2">
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="w-full justify-start">
          <Filter className="h-4 w-4" />
          {isExpanded && (
            <>
              <span className="ml-2">필터</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 overflow-auto h-full">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">필터 설정</h3>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기간 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {filters.dateRange.from.toLocaleDateString()} ~ {filters.dateRange.to.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                소비 성향
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {spendingTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spending-${type}`}
                    checked={filters.spendingTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...filters.spendingTypes, type]
                        : filters.spendingTypes.filter((t) => t !== type)
                      updateFilters({ spendingTypes: newTypes })
                    }}
                  />
                  <Label htmlFor={`spending-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                연령대
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ageGroups.map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${age}`}
                    checked={filters.ageGroups.includes(age)}
                    onCheckedChange={(checked) => {
                      const newAges = checked ? [...filters.ageGroups, age] : filters.ageGroups.filter((a) => a !== age)
                      updateFilters({ ageGroups: newAges })
                    }}
                  />
                  <Label htmlFor={`age-${age}`} className="text-sm">
                    {age}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                직업군
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {occupations.map((occupation) => (
                <div key={occupation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`occupation-${occupation}`}
                    checked={filters.occupations.includes(occupation)}
                    onCheckedChange={(checked) => {
                      const newOccupations = checked
                        ? [...filters.occupations, occupation]
                        : filters.occupations.filter((o) => o !== occupation)
                      updateFilters({ occupations: newOccupations })
                    }}
                  />
                  <Label htmlFor={`occupation-${occupation}`} className="text-sm">
                    {occupation}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                소득 분위
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "1-3분위", value: [1, 2, 3] },
                { label: "4-6분위", value: [4, 5, 6] },
                { label: "7-10분위", value: [7, 8, 9, 10] },
              ].map((group) => (
                <div key={group.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`income-${group.label}`}
                    checked={group.value.some((v) => filters.incomeDeciles.includes(v))}
                    onCheckedChange={(checked) => {
                      const newDeciles = checked
                        ? [...new Set([...filters.incomeDeciles, ...group.value])]
                        : filters.incomeDeciles.filter((d) => !group.value.includes(d))
                      updateFilters({ incomeDeciles: newDeciles })
                    }}
                  />
                  <Label htmlFor={`income-${group.label}`} className="text-sm">
                    {group.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
