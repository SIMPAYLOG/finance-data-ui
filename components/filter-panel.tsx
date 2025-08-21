"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { useState } from "react"

interface FilterPanelProps {
  filters: any
  onFiltersChange: (filters: any) => void
  hideTransactionFilter?: boolean
}

export default function FilterPanel({ filters, onFiltersChange, hideTransactionFilter = false }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // const categories = ["식비", "교통비", "쇼핑", "문화생활", "의료비", "교육비", "주거비", "통신비", "기타"]
  // const spendingTypes = ["소비지향형", "저축지향형", "무계획형", "균형형"]
  // const ageGroups = ["20대", "30대", "40대", "50대", "60대 이상"]
  // const occupations = ["IT 개발자", "금융업", "제조업", "서비스업", "공무원", "자영업", "학생", "기타"]

  // const handleCategoryToggle = (category: string) => {
  //   const newCategories = filters.categories.includes(category)
  //     ? filters.categories.filter((c: string) => c !== category)
  //     : [...filters.categories, category]

  //   onFiltersChange({
  //     ...filters,
  //     categories: newCategories,
  //   })
  // }

  // const handleAmountRangeChange = (values: number[]) => {
  //   onFiltersChange({
  //     ...filters,
  //     amountRange: { min: values[0], max: values[1] },
  //   })
  // }

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { start: null, end: null },
      // categories: [],
      // subcategories: [],
      transactionType: "WITHDRAW",
      // spendingType: "all",
      // ageGroup: "all",
      // occupation: "all",
      // incomeDecile: "all",
      // amountRange: { min: 0, max: 10000000 },
    })
  }

  return (
    <Card className="mx-6 mt-4">
      <CardContent className="p-4">
        {/* Basic Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Label className="font-medium">필터</Label>
          </div>
          <div className="flex items-center gap-2">
             <Label className="text-sm">기간:</Label>
             <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              }
              className="w-36"
            />
            <span className="text-sm text-muted-foreground">~</span>
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              }
              className="w-36"
            />

            {/* Transaction Type */}
            {!hideTransactionFilter && (
           <div className="flex items-center gap-2">
             <Label className="text-sm">거래 유형:</Label>
             <Select
              value={filters.transactionType}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  transactionType: value,
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="all">전체</SelectItem> */}
                <SelectItem value="DEPOSIT">수입</SelectItem>
                <SelectItem value="WITHDRAW">지출</SelectItem>
              </SelectContent>
            </Select>
          </div>
          )}
          </div>
          {/* <Button variant="outline" size="sm" onClick={clearAllFilters}>
            필터 초기화
          </Button> */}
        </div>
      </CardContent>
    </Card>


    // <Card className="mx-6 mt-4">
    //   <CardContent className="p-4">
    //     {/* Basic Filters */}
    //     <div className="flex items-center gap-4 flex-wrap">
    //       <div className="flex items-center gap-2">
    //         <Filter className="h-4 w-4" />
    //         <Label className="font-medium">필터</Label>
    //       </div>

    //       {/* Date Range */}
    //       <div className="flex items-center gap-2">
    //         <Label className="text-sm">기간:</Label>
    //         <Input
    //           type="date"
    //           value={filters.dateRange.start}
    //           onChange={(e) =>
    //             onFiltersChange({
    //               ...filters,
    //               dateRange: { ...filters.dateRange, start: e.target.value },
    //             })
    //           }
    //           className="w-36"
    //         />
    //         <span className="text-sm text-muted-foreground">~</span>
    //         <Input
    //           type="date"
    //           value={filters.dateRange.end}
    //           onChange={(e) =>
    //             onFiltersChange({
    //               ...filters,
    //               dateRange: { ...filters.dateRange, end: e.target.value },
    //             })
    //           }
    //           className="w-36"
    //         />
    //       </div>

    //       {/* Transaction Type */}
    //       <div className="flex items-center gap-2">
    //         <Label className="text-sm">거래 유형:</Label>
    //         <Select
    //           value={filters.transactionType}
    //           onValueChange={(value) =>
    //             onFiltersChange({
    //               ...filters,
    //               transactionType: value,
    //             })
    //           }
    //         >
    //           <SelectTrigger className="w-32">
    //             <SelectValue />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="all">전체</SelectItem>
    //             <SelectItem value="DEPOSIT">수입</SelectItem>
    //             <SelectItem value="WITHDRAW">지출</SelectItem>
    //           </SelectContent>
    //         </Select>
    //       </div>

    //       <Button
    //         variant="outline"
    //         size="sm"
    //         onClick={() => setIsExpanded(!isExpanded)}
    //         className="flex items-center gap-2"
    //       >
    //         고급 필터
    //         {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    //       </Button>

    //       <Button variant="outline" size="sm" onClick={clearAllFilters}>
    //         필터 초기화
    //       </Button>
    //     </div>

    //     {/* Advanced Filters */}
    //     {isExpanded && (
    //       <div className="mt-6 space-y-6 border-t pt-6">
    //         {/* Categories */}
    //         <div>
    //           <Label className="text-sm mb-2 block">카테고리:</Label>
    //           <div className="flex flex-wrap gap-2">
    //             {categories.map((category) => (
    //               <Badge
    //                 key={category}
    //                 variant={filters.categories.includes(category) ? "default" : "outline"}
    //                 className="cursor-pointer"
    //                 onClick={() => handleCategoryToggle(category)}
    //               >
    //                 {category}
    //                 {filters.categories.includes(category) && <X className="h-3 w-3 ml-1" />}
    //               </Badge>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Amount Range */}
    //         <div>
    //           <Label className="text-sm mb-2 block">
    //             거래 금액 범위: {(filters.amountRange.min / 10000).toLocaleString()}만원 ~{" "}
    //             {(filters.amountRange.max / 10000).toLocaleString()}만원
    //           </Label>
    //           <Slider
    //             value={[filters.amountRange.min, filters.amountRange.max]}
    //             onValueChange={handleAmountRangeChange}
    //             max={10000000}
    //             min={0}
    //             step={100000}
    //             className="w-full"
    //           />
    //         </div>

    //         {/* Collective Analysis Filters */}
    //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    //             <div>
    //               <Label className="text-sm mb-2 block">소비 성향:</Label>
    //               <Select
    //                 value={filters.spendingType}
    //                 onValueChange={(value) =>
    //                   onFiltersChange({
    //                     ...filters,
    //                     spendingType: value,
    //                   })
    //                 }
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="all">전체</SelectItem>
    //                   {spendingTypes.map((type) => (
    //                     <SelectItem key={type} value={type}>
    //                       {type}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //             </div>

    //             <div>
    //               <Label className="text-sm mb-2 block">연령대:</Label>
    //               <Select
    //                 value={filters.ageGroup}
    //                 onValueChange={(value) =>
    //                   onFiltersChange({
    //                     ...filters,
    //                     ageGroup: value,
    //                   })
    //                 }
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="all">전체</SelectItem>
    //                   {ageGroups.map((age) => (
    //                     <SelectItem key={age} value={age}>
    //                       {age}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //             </div>

    //             <div>
    //               <Label className="text-sm mb-2 block">직업군:</Label>
    //               <Select
    //                 value={filters.occupation}
    //                 onValueChange={(value) =>
    //                   onFiltersChange({
    //                     ...filters,
    //                     occupation: value,
    //                   })
    //                 }
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="all">전체</SelectItem>
    //                   {occupations.map((job) => (
    //                     <SelectItem key={job} value={job}>
    //                       {job}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //             </div>

    //             <div>
    //               <Label className="text-sm mb-2 block">소득 분위:</Label>
    //               <Select
    //                 value={filters.incomeDecile}
    //                 onValueChange={(value) =>
    //                   onFiltersChange({
    //                     ...filters,
    //                     incomeDecile: value,
    //                   })
    //                 }
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="all">전체</SelectItem>
    //                   {Array.from({ length: 10 }, (_, i) => i + 1).map((decile) => (
    //                     <SelectItem key={decile} value={decile.toString()}>
    //                       {decile}분위
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //           </div>
    //       </div>
    //     )}
    //   </CardContent>
    // </Card>
  )
}
