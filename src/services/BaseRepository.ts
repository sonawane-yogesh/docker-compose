const globalAny: any = global;
import { Request } from "express";
import IBaseRepository from "./IBaseRepository";
import Mongoose, { HydratedDocument, Document,  UpdateQuery } from 'mongoose';
import { Db, Collection, ObjectId } from 'mongodb';
import { PartialObject } from 'lodash';
import { EntityBase } from "../models";
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');
const mongooseLeanDefaults = require('mongoose-lean-defaults').default;
const mongooseAutopopulate = require('mongoose-autopopulate');

const dbConnection: Mongoose.Connection = globalAny.dbConnection as Mongoose.Connection;
let mongoDbConnection: Db = globalAny.mongoDbConnection as Db;
export default class BaseRepository<TSource extends EntityBase> implements IBaseRepository<TSource>{
    public schemaDefaults: Object = { autopopulate: true, versionKey: false, virtuals: true, getters: true, defaults: true, flattenMap: false };
    public mongooseModel: Mongoose.Model<TSource>;
    public mongoDbModel: Collection<TSource>;
    public mongooseConnection: Mongoose.Connection = dbConnection;
    public mongooseQuery: Mongoose.Query<TSource, TSource>;
    // public mongooseQuery: Mongoose.Query<TSource>;
    constructor({ collectionName, schema }: { collectionName: string; schema: Mongoose.Schema<TSource> }) {
        schema.plugin(mongooseAutopopulate);
        schema.plugin(mongooseLeanVirtuals);
        schema.plugin(mongooseLeanGetters);
        schema.plugin(mongooseLeanDefaults);
        schema.set("versionKey", false);
        // schema.set("usePushEach", true);
        this.checkVirtuals(schema);
        schema.set('toJSON', this.schemaDefaults);
        schema.set('toObject', this.schemaDefaults);
        // this.mongoDbModel = mongoDbConnection.collection<TSource>(collectionName);
        this.mongooseModel = dbConnection.model<TSource>(collectionName, schema, collectionName);
        this.mongooseQuery = new Mongoose.Query<TSource, TSource>();
    };
    private checkVirtuals = function (schema: Mongoose.Schema<TSource>) {
        if (!schema.statics.hasOwnProperty("useVirtuals")) return;
        schema.pre("aggregate", function (next: Function) {
            for (const key in schema.statics.useVirtuals) {
                // @ts-ignore
                const value: object = schema.statics.useVirtuals[key].value;
                schema.virtual(key, value);
                // @ts-ignore
                // const fields: string[] = schema.statics.useVirtuals[key].fields || [];
                // schema.path(key, { ref: key, autopopulate: { select: fields, maxDepth: 3 }, type: Mongoose.Schema.Types.ObjectId });
                // @ts-ignore
                const pipeLine: { from: string, localField: string, foreignField: string, as: string } = (({ from, localField, foreignField, as }) => ({ from, localField, foreignField, as }))(schema.statics.useVirtuals[key].value);
                // @ts-ignore
                const unWind: boolean = schema.statics.useVirtuals[key].unWind || false;
                // unWind ? this.lookup(pipeLine).unwind(key) : this.lookup(pipeLine);
                if (unWind) {
                    // @ts-ignore
                    this.lookup(pipeLine).unwind(key);
                } else {
                    // @ts-ignore
                    this.lookup(pipeLine);
                }
            }
            // following stage is added in MongoDB 5.x version.
            // @ts-ignore
            // this._pipeline.push({ $setWindowFields: { sortBy: { _id: 1 }, output: { SrNo: { $documentNumber: {} } } } });

            // @ts-ignore                        
            // this._pipeline.push({ $set: { SrNo: { $function: { body: "function() {try { ++rowNo} catch (e) {rowNo = 1;} return rowNo;}", args: [], lang: "js" } } } });

            next();
        });
    };
    updateDocuments(conditions: Partial<TSource>, fieldsToUpdate: Partial<TSource>): Promise<TSource[]> {
        throw new Error("Method not implemented.");
    };
    async updateDocument(conditions: Mongoose.FilterQuery<TSource>, fieldsToUpdate: Mongoose.UpdateQuery<TSource>): Promise<Mongoose.UpdateQuery<any>> {
        return await this.mongooseModel.updateOne(conditions, fieldsToUpdate, { multi: true, upsert: false });
    };
    getModel(): Mongoose.Model<TSource> {
        return this.mongooseModel;
    };
    mongoDbCollection(collName: string): Collection<TSource> {
        if (mongoDbConnection instanceof Db) {
            return mongoDbConnection.collection<TSource>(collName);
        }
        mongoDbConnection = globalAny.mongoDbConnection as Db;
        return mongoDbConnection.collection<TSource>(collName);
    };
    async getItem(filter: Object | PartialObject<TSource>, projection?: Object | string | null): Promise<Array<TSource>> {
        return await this.mongooseModel.findOne(<any>filter, projection).lean(this.schemaDefaults);
    };
    async getAllDocuments(projection?: Object, limit?: number, skip?: number, sort?: HydratedDocument<TSource> | Object): Promise<Array<TSource>> {
        return (await this.mongooseModel.find({}, projection).sort(sort as any).skip(skip).limit(limit)).map((docs: TSource): any => docs.toObject());  //.lean(this.leanDefaults);
    };
    async getDocuments(filter: PartialObject<TSource>, projection?: Object | string | null, options?: Object, sort?: PartialObject<TSource> | Object): Promise<Document<TSource>[]> {
        return await this.mongooseModel.find(<any>filter, projection, options).sort(sort as any).lean(this.schemaDefaults);
    };
    async searchDocument(filter: PartialObject<TSource>, projection?: Object | string | null, options?: Object): Promise<Document<TSource>[]> {
        return await this.mongooseModel.find(<any>filter, projection, options).lean(this.schemaDefaults);
    };
    async findById(id: string | ObjectId, projection?: Object | string | null): Promise<Array<TSource>> {
        var _id = id instanceof ObjectId ? id : new Mongoose.Types.ObjectId(id);
        return await this.mongooseModel.findById(_id, projection).lean(this.schemaDefaults);
    };
    async remove(id: string | ObjectId): Promise<Mongoose.Query<TSource, TSource>> {
        var _id = id instanceof ObjectId ? id : new Mongoose.Types.ObjectId(id);
        return await this.mongooseModel.findByIdAndRemove(_id);
    };
    async updateOrInsert(item: TSource | Document<TSource> | any): Promise<any> {
        try {
            item._id = !item._id || typeof item._id === "undefined" ? new Mongoose.Types.ObjectId() : item._id;
            return await this.mongooseModel.updateOne({ _id: item._id }, <any>{ $set: item }, { upsert: true, multi: true });
        } catch (err) {
            console.log(err);
            throw new Error(JSON.stringify(err));
        }
    };
    async findByIdAndUpdate(id: string | ObjectId, fieldsToUpdate: UpdateQuery<TSource>): Promise<TSource> {
        var _id: ObjectId = id instanceof ObjectId ? id : new Mongoose.Types.ObjectId(id);
        return await this.mongooseModel.findByIdAndUpdate(_id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }); // .lean(this.schemaDefaults);
    };
    async addItem(item: TSource | Array<TSource>): Promise<TSource> {
        try {
            // @ts-ignore
            return await this.mongooseModel.create(item);
        } catch (err) {
            console.log(err)
            throw new Error(JSON.stringify(err));
        }
    };
    async aggregate(pipeLine?: Array<Object> | any): Promise<Array<TSource>> {
        return await this.mongooseModel.aggregate(pipeLine).exec();
    };
    async removeAll(filter: PartialObject<TSource>, options?: any): Promise<TSource[]> {
        return await this.mongooseModel.deleteMany(<any>filter, options).lean(this.schemaDefaults);
    };
    async bulkInsert(items: Array<TSource> | TSource): Promise<Array<TSource>> {
        if (!Array.isArray(items)) items = [items];
        return await this.mongooseModel.insertMany(items, {lean: true});
    };
    /**
     * This function can be used to get any key, function and property of BaseRepository class 
     * @param methodName Known property name. Ex get, post, searchOne
     * @memberof BaseRepository
     */
    findMethod = function findMethod(methodName: string): Function {
        return this[methodName];
    };
    get = async (request: Request): Promise<Document<TSource>[]> => {
        try {
            const filter: PartialObject<TSource> | null = <any>request.query; // as unknown as PartialObject<TSource> | null;
            return await this.mongooseModel.find(<any>filter).lean(this.schemaDefaults);
        } catch (error) {
            console.log("Error in get method of BaseRepository");
            throw new Error(JSON.stringify(error));
        }
    };
    post = async function (request: Request): Promise<TSource> {
        try {
            const document: TSource | PartialObject<TSource> = request.body;
            return (await this.mongooseModel.create(document)).toObject();
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify(error));
        }
    };
    searchOne = async (request: Request): Promise<Array<TSource>> => {
        try {
            return await this.mongooseModel.findOne(<any>request.query).lean(this.schemaDefaults);
        } catch (error) {
            console.log("Error in get method of BaseRepository");
            throw new Error(JSON.stringify(error));
        }
    };
    delete = (request: Request): Promise<TSource> => new Promise((resolve, reject) => {
        try {
            let id: string | ObjectId = <string | ObjectId>request.query._id;
            var _id = id instanceof ObjectId ? id : new Mongoose.Types.ObjectId(id);
            this.mongooseModel.findByIdAndRemove(_id, (err: any, res: any) => {
                if (err) return reject(err);

                resolve(res);
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}