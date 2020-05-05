import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { MetaDataKeys as Keys, RouteMethods } from "./utils";
export const router = express.Router();

export const controller = (prefix: string) => {
  return (target: Function) => {
    // tslint:disable-next-line: forin
    for (const key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(Keys.path, target.prototype, key);

      if (path) {
        const [action, route]: [RouteMethods, string] = path.split(":");
        router[action](`${prefix}${route}`, routeHandler);
      }
    }
  };
};