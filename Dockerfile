FROM node:alpine3.18
ENV NODE_ENV=production
WORKDIR /node-docker
ENV HOST="127.0.0.1" \
    PORT=3000 \
    MONGODB_HOST="127.0.0.1" \
    MONGODB_PORT=27017 \
    MONGODB_USERNAME=yogeshs \
    MONGODB_PWD=yogeshs
RUN mkdir -p /home/app
COPY src ./src
COPY ["tests", "package.json", "tsconfig.json", "tslint.json", "nodemon.json", "Jenkinsfile", "docker-compose.yaml", ".gitignore", "./"]
RUN npm install
RUN npm run build-ts
EXPOSE 3000
CMD [ "nodemon", "--ignore public/", "--inspect=127.0.0.1:9222", "/home/app/dist/server-app.js", ]