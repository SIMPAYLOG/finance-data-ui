import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIMPAYLOG - 금융데이터 트랜잭션 생성 서비스",
  description: "조건 기반으로 현실적인 소비 데이터를 생성하고 분석하세요"
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}