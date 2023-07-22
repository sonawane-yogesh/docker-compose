import BaseRepository from './BaseRepository';
import { Db, MongoClient } from 'mongodb';
import Mongoose from 'mongoose';
import { EntityBase, UserMaster, UserMasterSchema, MultipleCollectionsConfig } from "../models";
const globalAny: any = global;
const dbConnection: Mongoose.Connection = globalAny.dbConnection as Mongoose.Connection;
const mongoClient: MongoClient = globalAny.mongoDbClient as MongoClient;
class AppService {
    public mongoDbClient: MongoClient;
    public mongooseConnection: Mongoose.Connection = dbConnection;
    public mongoDatabase: Db;
    constructor() {
        this.mongoDbClient = mongoClient;
        this.mongooseConnection = dbConnection;
    }
    public userMaster: BaseRepository<UserMaster> = new BaseRepository<UserMaster>({ collectionName: "user-master", schema: UserMasterSchema });

    public schemaDefaults: Object = { autopopulate: true, versionKey: false, virtuals: true, getters: true, defaults: true, flattenMap: false };
    get = function <T extends EntityBase>(propertyName: string): BaseRepository<T> { return this[propertyName]; };
    dataSets = async (collections: Array<MultipleCollectionsConfig>): Promise<Array<{ collection: string, documents: any[] }>> => {
        var tableData: Array<{ collection: string, documents: any[] }> = [];
        for (const key of collections) {
            var model = this.mongooseConnection.model(key.collection);
            var docs = await model.find(key.filter, key.projection, key.options).lean(this.schemaDefaults);
            tableData.push({ collection: key.collection, documents: docs });
        }
        return tableData;
    };
}
const appService: AppService = new AppService();
export default appService;