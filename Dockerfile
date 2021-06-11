### BUILD IMAGE

FROM node:14.16.0-slim AS builder

RUN apt-get update && \
  apt-get -y install g++ build-essential python && \
  apt-get clean

WORKDIR /src

# install build dependencies
ADD ./backend/package.json ./backend/yarn.lock ./backend/
RUN cd ./backend && yarn install
ADD ./frontend/package.json ./frontend/yarn.lock ./frontend/
RUN cd ./frontend && yarn install

# build applications
ADD ./frontend ./frontend
RUN cd ./frontend && yarn build
ADD ./backend ./backend
RUN cd ./backend && yarn build

### RUNTIME IMAGE

FROM node:14.16.0-slim

WORKDIR /app

ENV NODE_ENV=production

# install runtime dependencies
ADD ./backend/package.json ./backend/yarn.lock ./backend/
RUN cd ./backend && yarn install
ADD ./frontend/package.json ./frontend/yarn.lock ./frontend/
RUN cd ./frontend && yarn install

# copy build artefacts from builder
ADD ./backend ./backend
COPY --from=builder /src/backend/dist ./backend/dist
ADD ./frontend ./frontend
COPY --from=builder /src/frontend/.nuxt ./frontend/.nuxt

ADD ./deploy/docker-entrypoint.sh /usr/local/bin/

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD ["/bin/bash"]
