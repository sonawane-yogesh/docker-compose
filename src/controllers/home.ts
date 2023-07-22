import Express, { Request, Response, Router, NextFunction } from "express";
const homeRouter: Router = Express.Router();

homeRouter.get("/status", function (request: Request, response: Response) {
    response.status(200).json({ message: "API is up and running", status: "OK" }).end();
});

module.exports = homeRouter;