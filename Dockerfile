# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY web/frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY web/frontend/ ./frontend/
RUN cd frontend && npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY web/backend/package*.json ./backend/
RUN cd backend && npm install
COPY web/backend/ ./backend/
COPY --from=build /app/frontend/dist ./backend/public

EXPOSE 5000
CMD ["node", "backend/server.js"]
