# Stage 1: Build the SPA
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
# Note: nginx master process runs as root (required for ports <1024 and cert access).
# Worker processes are demoted to 'nginx' user via the user directive in nginx.conf.
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
