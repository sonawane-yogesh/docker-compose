import { ObjectId } from "mongodb";
import Mongoose from "mongoose";
import { EntityBase } from ".";
var Jwt = require('jsonwebtoken');
var bcryptJs = require('bcryptjs');
import config from "../configs/configurations";
class UserMaster extends EntityBase {
    public userName: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public contact: string;
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    public isActive: boolean;
}

const UserMasterSchema: Mongoose.Schema<UserMaster> = new Mongoose.Schema<UserMaster>({
    _id: { type: ObjectId, select: true, required: false, auto: true },
    userName: { type: String, select: true, required: true },
    password: { type: String, select: true, required: true },
    firstName: { type: String, select: true, required: true },
    lastName: { type: String, select: true, required: true },
    email: { type: String, select: true, required: true },
    contact: { type: String, select: true, required: true },    
    isActive: { type: Boolean, required: false, default: true }
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

UserMasterSchema.statics.useVirtuals = {} as any;

UserMasterSchema.pre("save", function (next: Function) {
    var userMaster: any = this;
    if (userMaster.isModified("password")) {
        bcryptJs.genSalt(10, function (err: any, salt: Number) {
            bcryptJs.hash(userMaster.password, salt, function (e: any, hash: any) {
                userMaster.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserMasterSchema.methods.generateAuthToken = function () {
    var userMaster = this.toJSON();
    delete userMaster.password;
    userMaster._id = userMaster._id.toHexString();
    var token = Jwt.sign({ user: userMaster }, config.secretKey).toString();
    return token;
};
UserMasterSchema.statics.generateAuthTokenOne = function (userMaster: any) {
    delete userMaster.password;
    userMaster._id = userMaster._id.toHexString();
    var token = Jwt.sign({ user: userMaster }, config.secretKey).toString();
    return token;
}

UserMasterSchema.statics.findByCredentials = async function (userName: string, password: string) {
    const user = await this.aggregate([{ $match: { userName: userName } }]);
    if (!user || user.length == 0) {
        return Promise.reject('User Not Found');
    }
    return await new Promise((resolve, reject) => {
        var u = user.shift();
        bcryptJs.compare(password, u.password, function (err: any, res: any) {
            if (err) reject(err);
            if (res) {
                delete u.password;
                resolve(u);
            } else {
                reject('Invalid username or password');
            }
        });
    });
};

export { UserMaster, UserMasterSchema };
