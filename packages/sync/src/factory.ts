/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IDestructor } from "@lizzi/core";
import { SyncObjectType } from "./sync";

export class zzSyncFactory<
  IObject extends object,
  StringType extends string = string
> implements IDestructor
{
  readonly map: Map<StringType, new (...values: any) => IObject>;

  readonly defaultCreateFn: (
    constructor: new (...values: any[]) => IObject,
    ...values: any[]
  ) => IObject;
  readonly update: (object: IObject, values: { [key: string]: any }) => void;
  readonly get: (object: IObject) => SyncObjectType<IObject>;

  destroy() {
    this.map.clear();
  }

  create(type: StringType, ...values: any) {
    let objectClass = this.map.get(type);
    if (objectClass) {
      return this.defaultCreateFn(objectClass, ...values);
    }

    throw new Error("Can't find class for " + type);
  }

  find(type: StringType) {
    return this.map.get(type);
  }

  findType(object: IObject) {
    for (let [type, instance] of this.map) {
      if (object.constructor === instance) {
        return type;
      }
    }

    return null;
  }

  add: (type: StringType, constructorFn: (...values: any[]) => IObject) => void;

  constructor(
    defaultUpdateFn: (object: IObject, values: { [key: string]: any }) => void,
    defaultGetFn: (object: IObject) => SyncObjectType<IObject>,
    defaultCreateFn?: (
      constructor: new (...values: any[]) => IObject,
      ...values: any[]
    ) => IObject
  ) {
    this.map = new Map();

    this.defaultCreateFn =
      defaultCreateFn ??
      ((constructor: new (...values: any[]) => IObject, ...values: any[]) =>
        new constructor(...values));
    this.update = defaultUpdateFn;
    this.get = defaultGetFn;

    this.add = (type: StringType) => {
      return (constructorFn: new (...values: any[]) => IObject) =>
        this.map.set(type, constructorFn);
    };
  }
}
