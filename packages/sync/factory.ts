/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IDestructor } from "@lizzi/core/Destructor";

export class zzSyncFactory<
  ObjectType extends object,
  Type extends string = string
> implements IDestructor
{
  readonly map: Map<Type, (...values: any[]) => ObjectType>;

  destroy() {
    this.map.clear();
  }

  create(type: Type, ...values: any[]) {
    let constructorFn = this.map.get(type);
    if (constructorFn) {
      return constructorFn(...values);
    }

    throw new Error("Can't find class for " + type);
  }

  get(type: Type) {
    return this.map.get(type);
  }

  set(type: Type, constructorFn: (...values: any[]) => ObjectType) {
    this.map.set(type, constructorFn);

    return this;
  }

  findType(object: ObjectType) {
    for (let [type, instance] of this.map) {
      if (object.constructor === instance) {
        return type;
      }
    }

    return null;
  }

  constructor() {
    this.map = new Map();
  }
}
