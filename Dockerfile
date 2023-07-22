FROM node:18.16.0-alpine3.18
ENV HOST="127.0.0.1" \
    PORT=3000 \
    MONGODB_HOST="127.0.0.1" \
    MONGODB_PORT=27017 \
    MONGODB_USERNAME=yogeshs \
    MONGODB_PWD=yogeshs
RUN mkdir -p /home/app
COPY ["src", "tests", "package.json", "tsconfig.json", "tslint.json", "nodemon.json", "Jenkinsfile", "docker-compose.yaml", ".gitignore", "/home/app/"]
RUN "npm install --production"
RUN "npm run watch-ts"
EXPOSE 3000
CMD [ "nodemon", "--ignore public/", "--inspect=127.0.0.1:9222", "dist/server-app.js", ]