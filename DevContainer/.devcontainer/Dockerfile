FROM node:current-alpine
 
LABEL maintainer="steven.gray@ucl.ac.uk"
LABEL build_date="2024-08-12"

ENV TIMEZONE Europe/London

# Install Nginx
RUN	apk update && \
	apk upgrade && \
	apk add --update openssl nginx openrc && \
	apk add --update tzdata && \
	apk add --update curl bash git && \
	cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && \
	echo "${TIMEZONE}" > /etc/timezone && \
	mkdir /etc/nginx/certificates && \
	openssl req \
		-x509 \
		-newkey rsa:2048 \
		-keyout /etc/nginx/certificates/key.pem \
		-out /etc/nginx/certificates/cert.pem \
		-days 365 \
		-nodes \
		-subj /CN=localhost && \
	mkdir /www && \
	apk del tzdata && \
	rm -rf /var/cache/apk/*

COPY ./configuration/nginx.conf /etc/nginx/nginx.conf

# --------------------------------------------------------------------------------------------

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/local/nvm 
RUN chown node:node /usr/src/app
RUN chown node:node /usr/local/nvm

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app

# Setup permissions for the node user before running npm install
RUN mkdir -p node_modules/.cache && mkdir -p node_modules/bindings

RUN npm install nodemon -g 

COPY ./node .

RUN chown -R node:node /usr/src/app/

EXPOSE 3000 80 9229

USER node
HEALTHCHECK --interval=15s --timeout=10s --retries=5 --start-period=30s CMD node ./node/healthcheck.js
WORKDIR /usr/src/app/node
RUN npm install

# Run the nodejs app using nodemon - this will automatically restart the app when changes are made to the source files
# When ready to deploy, change this to use node instead of nodemon

WORKDIR /usr/src/app
USER root
ENTRYPOINT ["/usr/sbin/nginx"]
