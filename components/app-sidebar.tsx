"use client"

import { BarChart3, Home, Users, TrendingUp, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { ActiveView } from "@/app/analyze/page"

interface AppSidebarProps {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

const menuItems = [
  {
    title: "전체 분석",
    icon: Home,
    key: "dashboard" as ActiveView,
    description: "전체 개요 및 핵심 지표",
  },
  {
    title: "개인 분석",
    icon: TrendingUp,
    key: "analytics" as ActiveView,
    description: "개인 분석",
  },
  {
    title: "개인/전체 비교",
    icon: Users,
    key: "user-comparison" as ActiveView,
    description: "개별 vs 집단 비교",
  },
  {
    title: "설정",
    icon: Settings,
    key: "settings" as ActiveView,
    description: "데이터 커스터마이징",
  },
]

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>분석 도구</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton isActive={activeView === item.key} onClick={() => setActiveView(item.key)}>
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
