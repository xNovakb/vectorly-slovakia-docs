# Stage 1: build the static site
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve the built files
FROM nginx:alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
