import express from "express";
import { join } from "path";
import config from "./configs/configurations";
import { json, urlencoded } from 'body-parser';
import Cors from 'cors';
import './database/mongoose-config';
const app = express();
app.use(express.static(join(__dirname, "public")));
const port: number = <number>config.port;
app.use(json({ limit: '60mb' }));
app.use(urlencoded({ limit: '60mb', extended: true }));
app.use(Cors());
app.use(Cors({
    allowedHeaders: ["x-token", "Authorization"]
}));
var homeRouter = require('./controllers/home');
var usrMasterRouter = require('./controllers/user-master');
app.use("/yog/api/home", homeRouter);
app.use("/yog/api/user-master", usrMasterRouter);
app.listen(port, config.host, () => {
    console.log("listening on port: " + port);
});

export default app;