import Express, { Request, Response, Router } from "express";
import appService from "../services/app-service";
const userMasterRouter: Router = Express.Router();

userMasterRouter.get("/", function (request: Request, response: Response) {
    response.status(200).json({ message: "API is up and running", status: "OK" }).end();
}).get("/:id", function (request: Request, response: Response) {
    response.status(200).json({ message: "API is up and running", status: "OK" }).end();
}).post("/", function (request: Request, response: Response) {
    let userMaster = request.body;
    let um = appService.userMaster.addItem(userMaster);
    response.status(200).json(um).end();
});
module.exports = userMasterRouter;