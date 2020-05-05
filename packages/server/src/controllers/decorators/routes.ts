import "reflect-metadata";
import { MetaDataKeys as Keys, RouteDescriptor, RouteMethods as R } from "../utils";

const routeBinder = (method: string): Function => {
  return (path: string): Function => {
    return (target: any, key: string, desc: RouteDescriptor) => {
      Reflect.defineMetadata(Keys.path, `${method}:${path}`, target, key);
    };
  };
};

export const get = routeBinder(R.get);
export const post = routeBinder(R.post);
export const put = routeBinder(R.put);
export const patch = routeBinder(R.patch);
export const del = routeBinder(R.del);