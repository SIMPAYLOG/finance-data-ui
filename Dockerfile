FROM node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2) runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
# ARG NEXT_PUBLIC_API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# (필요 시 next.config.js, .env.production 등도 복사)
EXPOSE 3000
CMD ["npm", "start"]  # package.json: "start": "next start -p 3000"