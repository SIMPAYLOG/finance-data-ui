"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface FilterState {
  dateRange: { from: Date; to: Date }
  spendingTypes: string[]
  ageGroups: string[]
  occupations: string[]
  incomeDeciles: number[]
}

interface FilterContextType {
  filters: FilterState
  updateFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const defaultFilters: FilterState = {
  dateRange: {
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    to: new Date(),
  },
  spendingTypes: [],
  ageGroups: [],
  occupations: [],
  incomeDeciles: [],
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return <FilterContext.Provider value={{ filters, updateFilters, resetFilters }}>{children}</FilterContext.Provider>
}

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
