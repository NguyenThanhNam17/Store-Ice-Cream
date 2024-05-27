FROM node:16-alpine AS BUILD_IMAGE

# couchbase sdk requirements
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://raw.githubusercontent.com/goreleaser/goinstall/master/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --save --legacy-peer-deps

COPY . .

RUN npm run build-ts

RUN npm prune --production --legacy-peer-deps

# run node prune
RUN /usr/local/bin/node-prune

WORKDIR /usr/src/app

FROM node:16-alpine

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/docs ./docs
COPY --from=BUILD_IMAGE /usr/src/app/public ./public
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json

EXPOSE 5555

CMD [ "node", "dist/server.js"]