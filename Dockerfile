FROM node:18-alpine
ENV NODE_ENV=production
ENV HOST="127.0.0.1" \
    PORT=3000 \
    MONGODB_HOST="mongodb" \
    MONGODB_PORT=27017 \
    MONGODB_USERNAME=yogeshs \
    MONGODB_PWD=yogeshs
RUN mkdir -p /home/app
WORKDIR /home/app/node-docker
COPY . .
RUN npm install
RUN npm run build-ts
EXPOSE 3000
CMD [ "npm", "start"]