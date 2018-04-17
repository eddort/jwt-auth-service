FROM node:8.7
EXPOSE 8089
RUN mkdir /app
COPY src /app/src
COPY .env /app/.env
COPY bin /app/bin
COPY package.json /app/
COPY package-lock.json /app/
COPY .babelrc /app/.babelrc
RUN cd /app && npm i && npm run build
CMD node /app/build/main.js