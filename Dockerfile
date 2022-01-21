FROM node:16-alpine
LABEL maintainer="chris@meggsimum.de"


COPY  /package.json /opt/package.json

WORKDIR /opt
RUN npm install --only=production

# copy JS sources
COPY  /index.js /opt/index.js
COPY  /config /opt/config

CMD ["node", "index.js"]
