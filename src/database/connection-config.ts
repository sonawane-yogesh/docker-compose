import Mongoose from 'mongoose';
let auth: { username: string, password: string } = { username: "yogeshs", password: "yogeshs" };
let config: any = {
    auth: auth,
    userName: auth.username,
    password: auth.password,
    databaseName: "docker-test",
    mongoDbUrl: `mongodb://${auth.username}:${auth.password}@127.0.0.1:27017/`,
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