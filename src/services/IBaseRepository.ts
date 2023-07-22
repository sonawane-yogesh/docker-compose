import { Model, UpdateQuery, Document, Query } from "mongoose";
import { Collection, ObjectId } from 'mongodb';
import { PartialObject } from 'lodash';
import { EntityBase } from "../models";
export default interface IBaseRepository<TSource extends EntityBase> {
    getModel(): Model<TSource>;
    mongoDbCollection(collName: string): Collection<TSource>;
    addItem(item: TSource): Promise<TSource>;
    getItem(filter: Object): Promise<Array<TSource> | TSource>;
    getDocuments(filter: PartialObject<TSource>, projection?: Object | string | null, options?: Object): Promise<Document<TSource>[]>;
    getAllDocuments(): Promise<Array<TSource>>;
    findById(id: string | ObjectId, projection?: Object | string | null): Promise<Array<TSource>>;
    searchDocument(filter: PartialObject<TSource>, projection?: Object | string | null, options?: Object): Promise<Document<TSource>[]>;
    findByIdAndUpdate(id: string | ObjectId, fieldsToUpdate: UpdateQuery<TSource>): Promise<TSource>;
    updateDocuments(conditions: PartialObject<TSource>, fieldsToUpdate: PartialObject<TSource>): Promise<Array<TSource>>;
    bulkInsert(items: Array<TSource> | TSource): Promise<Array<TSource>>;
    remove(id: string | ObjectId): Promise<Query<TSource, TSource>>;
    // updateDocuments(conditions: PartialObject<TSource>, fieldsToUpdate: PartialObject<TSource>): Promise<Array<TSource>>;
    removeAll(filter: PartialObject<TSource>, options?: Object): Promise<Array<TSource>>;
}