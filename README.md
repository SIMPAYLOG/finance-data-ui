# 🌐 Finance Data UI

## 📌 프로젝트 개요 (Overview)
이 레포지토리는 **Transaction Data Generator 서비스의 프론트엔드** 애플리케이션입니다.  
사용자가 생성된 금융 트랜잭션 데이터를 **시각화·분석**할 수 있도록 웹 인터페이스를 제공합니다.

- 트랜잭션 데이터 조회 및 검색
- 카테고리별 소비/수입 패턴 분석 차트
- 사용자 시뮬레이션 결과 대시보드

백엔드 API 서버(`api` 모듈)와 통신하여 데이터를 가져오며, 프론트엔드와 백엔드 레포지토리는 **별도로 관리**됩니다.

---

## 🏗 기술 스택 (Tech Stack)
- **Framework**: Next.js / React
- **Language**: TypeScript / JavaScript
- **UI**: TailwindCSS, Chart.js (또는 Recharts)
- **Build & Deploy**: Docker, Vercel (optional)
- **API 통신**: REST API (백엔드 `api` 모듈)

---

## ✨ 주요 기능 (Features)
- **실시간 트랜잭션 데이터 시각화**
  - 카테고리별 소비 금액 차트
  - 일/주/월 단위 트렌드 분석
- **사용자별 대시보드**
  - 세션 단위 시뮬레이션 데이터 확인
  - 주요 지출/입금 내역 표시
- **검색 및 필터**
  - 기간별, 카테고리별 트랜잭션 필터링
- **반응형 UI**
  - 모바일/데스크톱 환경 최적화

---

## ⚙️ 설치 및 실행 방법 (Installation & Run)

### 1. 요구사항
- Node.js 20+
- npm 또는 yarn

### 2. 클론 및 설치
```bash
git clone https://github.com/SIMPAYLOG/finance-data-ui.git
cd finance-data-ui
docker compose up -d –build
