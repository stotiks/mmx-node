FROM alpine:edge AS build
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --update --no-cache bash git cmake build-base gmp-dev zlib-dev libsecp256k1-dev rocksdb-dev
WORKDIR /
RUN sh make_release.sh

FROM alpine:edge
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update --no-cache bash libsecp256k1 rocksdb libgomp screen
WORKDIR /mmx-node
COPY --from=build ["activate.sh", "run_*.sh", "./"]
COPY --from=build /build ./build
COPY --from=build /config ./config
COPY --from=build /kernel ./kernel
COPY --from=build /www ./www
RUN sh activate.sh