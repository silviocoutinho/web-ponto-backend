FROM keymetrics/pm2:latest-stretch

RUN mkdir -p /usr/app
RUN chmod -R 777 /usr/app
WORKDIR /usr/app

COPY src /usr/app/src
COPY *.json /usr/app/
COPY *.js /usr/app/
COPY .env /usr/app/

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production


EXPOSE 3005

RUN ls /usr/app/
RUN ls /usr/app/src


CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]