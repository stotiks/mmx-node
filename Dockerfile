FROM alpine:edge AS build
MAINTAINER Peyton
ENV TZ=Asia/Phnom_Penh
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --update --no-cache bash git cmake build-base gmp-dev zlib-dev libsecp256k1-dev rocksdb-dev
WORKDIR /mmx-node
RUN git clone https://github.com/madMAx43v3r/mmx-node.git . && \
        git submodule update --init --recursive
RUN sh make_release.sh

FROM alpine:edge
MAINTAINER Peyton
ENV TZ=Asia/Phnom_Penh
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update --no-cache bash libsecp256k1 rocksdb libgomp screen
WORKDIR /mmx-node
COPY --from=build ["/mmx-node/activate.sh", "/mmx-node/run_*.sh", "./"]
COPY --from=build /mmx-node/build ./build
COPY --from=build /mmx-node/config ./config
COPY --from=build /mmx-node/kernel ./kernel
COPY --from=build /mmx-node/www ./www
RUN sh activate.sh