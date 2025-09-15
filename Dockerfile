# build stage
FROM node:22-alpine AS builder
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json package-lock.json* ./
RUN npm ci --silent

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY public/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
