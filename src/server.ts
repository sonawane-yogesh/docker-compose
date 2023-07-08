import express from "express";
import { join } from "path";
const app = express();
app.use(express.static(join(__dirname, "public")));
const port: number = 3000;
var homeRouter = require('./controllers/home');
app.use("/api/home", homeRouter);
app.listen(port, "127.0.0.1", () => {
    console.log("listening on port: " + port);
});

export default app;