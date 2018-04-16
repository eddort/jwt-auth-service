FROM node:8.7
EXPOSE 8082
RUN mkdir /app
COPY src /app/src
COPY config /app/config
COPY bin /app/bin
COPY package.json /app/
RUN cd /app && npm i && npm run build
CMD node /app/build/main.js