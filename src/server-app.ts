import express, { NextFunction, Request, Response } from "express";
import { join } from "path";
import config from "./configs/configurations";
import { json, urlencoded } from 'body-parser';
import Cors from 'cors';
import './database/mongoose-config';
const app = express();
app.use(express.static(join(__dirname, "public")));

app.use(json({ limit: '60mb' }));
app.use(urlencoded({ limit: '60mb', extended: true }));
app.use(Cors());
app.use(Cors({
    allowedHeaders: ["x-token", "authorization"]
}));
app.get('/', function (request: Request, response: Response) {
    response.status(200).json({ msg: 'Server app is up and running!.' }).end();
});
app.use((err: any, req: Request, res: Response, next: Function) => {
    if (res.headersSent) return next();
    res.status(err.httpStatusCode || 500).render('UnknownError');
});
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("---=================================================================---");
    console.log(`---==== ${req.url} ====---`);
    next();
});

var homeRouter = require('./controllers/home');
var usrMasterRouter = require('./controllers/user-master');
app.use("/yog/api/home", homeRouter);
app.use("/yog/api/user-master", usrMasterRouter);

const port: number = <number>config.port;
app.listen(port, function () {
    var address: any = this.address();
    console.log(JSON.stringify(address));
    console.log(`Server application is up and running on port: ${port}`);
    console.log("This line added later when application already started!")
});

export default app;