FROM node:latest AS build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Build the app (if you have any build steps, otherwise skip)
# RUN yarn build

FROM postgres:13 AS db

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

COPY --from=build /usr/src/app /usr/src/app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/src/app

EXPOSE 5432

EXPOSE 3000

CMD service postgresql start && yarn start
