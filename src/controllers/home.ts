import Express, { Request, Response, Router, NextFunction } from "express";
const homeRouter: Router = Express.Router();

homeRouter.use("/", (request: Request, response: Response, next: NextFunction) => {
    next();
}).get("/get-status", function (request: Request, response: Response) {
    response.status(200).json({ message: "API is up and running", status: "OK" });
});

module.exports = homeRouter;