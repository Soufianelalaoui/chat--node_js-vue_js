FROM node:10.15.0 as ui-builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV VUE_APP_URL=https://api-hxiqeq32ca-oa.a.run.app/api/
ENV VUE_APP_SOCKET=https://socket-hxiqeq32ca-oa.a.run.app
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @vue/cli
COPY . /usr/src/app
RUN npm run build

FROM nginx
COPY  --from=ui-builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
