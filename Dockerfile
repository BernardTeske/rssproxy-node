FROM node:20-alpine

WORKDIR /app

COPY package.json index.js ./

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 -G nodejs

USER nodejs

EXPOSE 3000

CMD ["node", "index.js"]
