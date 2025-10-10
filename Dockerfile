# 1) Build stage
FROM node:20 AS build

WORKDIR /app

# package.json과 package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# package.json과 lock 파일 복사 후 production 의존성만 설치
COPY --from=build /app/package*.json ./
COPY --from=build /app/package-lock.json ./
RUN npm ci --omit=dev

# 빌드 결과물과 public 폴더 복사
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# 필요 시 next.config.js, .env.production 등도 복사 가능
# COPY --from=build /app/next.config.js ./
# COPY --from=build /app/.env.production ./

# 컨테이너 포트 노출
EXPOSE 3000

# OS 독립적 실행
CMD ["sh", "-c", "npm start"]
