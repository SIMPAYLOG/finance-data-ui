// 더미 데이터 정의
export interface Transaction {
  userId: number
  transactionType: "DEPOSIT" | "WITHDRAW"
  amount: number
  timestamp: string
  category: string
  subcategory?: string
}

export interface UserProfile {
  userId: number
  spendingType: "소비지향형" | "저축지향형" | "균형형"
  ageGroup: "20대" | "30대" | "40대" | "50대+"
  occupation: string
  incomeDecile: number
}

export const transactions: Transaction[] = [
  { userId: 1, transactionType: "DEPOSIT", amount: 2500000, timestamp: "2025-07-01", category: "salary" },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 120000,
    timestamp: "2025-07-03",
    category: "food",
    subcategory: "restaurant",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 80000,
    timestamp: "2025-07-04",
    category: "transport",
    subcategory: "subway",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 150000,
    timestamp: "2025-07-05",
    category: "shopping",
    subcategory: "clothing",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 45000,
    timestamp: "2025-07-06",
    category: "food",
    subcategory: "grocery",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 200000,
    timestamp: "2025-07-08",
    category: "shopping",
    subcategory: "electronics",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 60000,
    timestamp: "2025-07-10",
    category: "entertainment",
    subcategory: "movie",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 35000,
    timestamp: "2025-07-12",
    category: "transport",
    subcategory: "taxi",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 90000,
    timestamp: "2025-07-15",
    category: "food",
    subcategory: "restaurant",
  },
  {
    userId: 1,
    transactionType: "WITHDRAW",
    amount: 25000,
    timestamp: "2025-07-18",
    category: "healthcare",
    subcategory: "pharmacy",
  },
]

export const userProfiles: UserProfile[] = [
  {
    userId: 1,
    spendingType: "균형형",
    ageGroup: "30대",
    occupation: "회사원",
    incomeDecile: 6,
  },
]
