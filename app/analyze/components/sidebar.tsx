import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  Users,
  Wallet,
  Target,
} from "lucide-react"

export default function Sidebar() {
  const userProfile = {
    name: "김철수",
    age: "30대",
    occupation: "IT 개발자",
    incomeDecile: 7,
    spendingType: "균형형",
    avatar: "/placeholder.svg?height=40&width=40",
    monthlyBudget: 3000000,
    currentSpending: 2100000,
  }

  const menuItems = [
    { icon: PieChart, label: "대시보드", active: true },
    { icon: TrendingUp, label: "트렌드 분석", active: false },
    { icon: BarChart3, label: "비교 분석", active: false },
    { icon: Users, label: "집단 분석", active: false },
    { icon: Calendar, label: "기간별 분석", active: false },
    { icon: Target, label: "목표 관리", active: false },
    { icon: Settings, label: "설정", active: false },
    { icon: HelpCircle, label: "도움말", active: false },
  ]

  const spendingProgress = (userProfile.currentSpending / userProfile.monthlyBudget) * 100

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6">
      {/* User Profile */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{userProfile.name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile.age}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">직업</span>
              <Badge variant="secondary">{userProfile.occupation}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">소득 분위</span>
              <Badge variant="outline">{userProfile.incomeDecile}분위</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">소비 성향</span>
              <Badge variant="default">{userProfile.spendingType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Budget Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-4 w-4" />
            <h4 className="font-medium">이번 달 예산</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>사용: {(userProfile.currentSpending / 10000).toLocaleString()}만원</span>
              <span>예산: {(userProfile.monthlyBudget / 10000).toLocaleString()}만원</span>
            </div>
            <Progress value={spendingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {spendingProgress > 80 ? "예산 초과 위험" : "예산 내 관리 중"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              item.active ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
