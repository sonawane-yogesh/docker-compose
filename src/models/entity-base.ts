import Mongoose from "mongoose";
import { ObjectId } from "mongodb";

export default class EntityBase extends Mongoose.Document {
    _id: ObjectId | string | any;
    private _createdOn: Date = new Date();
    private _updatedOn: Date = new Date();
    get createdOn(): Date {
        return this._createdOn;
    }
    set createdOn(value: Date) {
        this._createdOn = value;
    }
    get updatedOn(): Date {
        return this._updatedOn;
    }
    set updatedOn(value: Date) {
        this._updatedOn = value;
    }
    createdBy: string | ObjectId;
}