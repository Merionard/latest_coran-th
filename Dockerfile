FROM node:18

WORKDIR /app

ARG GOOGLE_CLIENT_ID=default-client-id
ARG GOOGLE_CLIENT_SECRET=default-client-secret
ARG DATABASE_URL=postgres://test

ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json .

COPY . .

RUN npm install

EXPOSE 3000

RUN npm run build

CMD ["npm","run","start"]