FROM node:14-alpine as builder

WORKDIR '/app'
RUN npm install yarn

COPY package.json .
RUN yarn install

COPY . .
RUN yarn build


FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build usr/share/nginx/html


