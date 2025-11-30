FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production-stage

RUN rm /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf.template

COPY --from=build-stage /app/dist /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]