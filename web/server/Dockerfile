FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm --loglevel=error install && npm install -g nodemon
ENV NODE_PATH=/app/node_modules
ENV PATH="${NODE_PATH}/.bin:${PATH}"
COPY . .

EXPOSE 5000

ENTRYPOINT npm run dev