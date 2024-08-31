FROM node:18
LABEL vendor="Merionard"
LABEL authors="Merionard"
LABEL website="https://github.com/Merionard/latest_coran-th"
LABEL version="latest"
LABEL date="2024-08-30"

WORKDIR /app

ARG GOOGLE_CLIENT_ID=default-client-id
ARG GOOGLE_CLIENT_SECRET=default-client-secret
ARG DATABASE_URL=postgres://test

ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}


COPY . .

RUN npm install

EXPOSE 3000

#CMD ["npm","run","start"]
CMD ["./docker-entrypoint.sh"]
#CMD ["sleep", "infinity"]
