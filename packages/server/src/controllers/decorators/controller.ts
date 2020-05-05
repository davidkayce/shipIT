import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { MetaDataKeys as Keys, RouteMethods } from "../utils";
export const router = express.Router();

const bodyValidator = (schema: any): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) { res.status(422).send("Invalid request data"); }
    // if (req.body)
    if (!schema) { next(); }
    next();
  };
};

export const controller = (prefix: string) => {
  return (target: Function) => {
    // tslint:disable-next-line: forin
    for (const key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(Keys.path, target.prototype, key);
      const middlewares = Reflect.getMetadata(Keys.mid, target.prototype, key) || [];
      const requiredBody = Reflect.getMetadata(Keys.validator, target.prototype, key) || null;
      const validator = bodyValidator(requiredBody);

      if (path) {
        const [action, route]: [RouteMethods, string] = path.split(":");
        router[action](`${prefix}${route}`, validator, ...middlewares, routeHandler);
      }
    }
  };
};