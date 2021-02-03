FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm --loglevel=error install

EXPOSE 5000
COPY . .

ENTRYPOINT npm run dev