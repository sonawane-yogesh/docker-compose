@ECHO OFF
ECHO ======================================================================================
ECHO Start MongoDb Server, typescript(watch mode), nodemon(watch mode).
ECHO ======================================================================================
START CMD /c "npm run watch-ts"
PAUSE
START CMD /c "npm run watch-node"