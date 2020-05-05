import { RequestHandler } from 'express';

export enum RouteMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  del = 'delete'
}

export enum MetaDataKeys {
  path = 'path',
  mid = 'middleware',
  validator = 'validator'
}

export interface RouteDescriptor extends PropertyDescriptor {
  // To ensure only valid routes pass through the decorators
  value?: RequestHandler
}