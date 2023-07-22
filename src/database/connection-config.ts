import Mongoose from 'mongoose';
import envConfig from "../configs/configurations";
let auth: { username: string, password: string } = { username: envConfig.mongoDbUsername, password: envConfig.mongoDbPassword };
let config: any = {
    auth: auth,
    userName: auth.username,
    password: auth.password,
    databaseName: "docker-test",
    mongoDbUrl: `mongodb://${auth.username}:${auth.password}@${envConfig.mongoDbHost}:${envConfig.mongoDbPort}/`,
};
const mongoDbOpt: Mongoose.ConnectOptions = {
    dbName: config.databaseName,
    tls: false,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    readPreference: 'secondary',
    auth: auth
};
export { mongoDbOpt, config };