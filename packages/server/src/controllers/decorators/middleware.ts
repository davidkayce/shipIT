import { RequestHandler } from "express";
import "reflect-metadata";
import { MetaDataKeys as Keys, RouteDescriptor } from "../utils";

export const use = (middleware: RequestHandler) => {
  return (target: any, key: string, desc: RouteDescriptor) => {
    const middlewares = Reflect.getMetadata(Keys.mid, target, key) || [];
    Reflect.defineMetadata(Keys.mid, [...middlewares, middleware], target, key);
  };
};

export const auth = (roles: string[]) => {
  // TODO: tie this with an auth function somewhere where you can specify roles for endpoints
  let authMiddleware: RequestHandler;
  return (target: any, key: string, desc: RouteDescriptor) => {
    const middlewares = Reflect.getMetadata(Keys.mid, target, key) || [];
    Reflect.defineMetadata(Keys.mid, [...middlewares, authMiddleware], target, key);
  };
};

export const validateBody = (schema: any) => {
  return (target: any, key: string, desc: RouteDescriptor) => {
    Reflect.defineMetadata(Keys.validator, schema, target, key);
  };
};