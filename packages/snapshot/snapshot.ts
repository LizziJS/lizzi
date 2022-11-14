/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import {
  ISnapshotType,
  ISnapshotValue,
  ArrayDecorator,
  ObjectDecorator,
  ObjectPrimaryValueDecorator,
  ObjectRequiedValueDecorator,
  ObjectValueDecorator,
} from "./decorators";

export class Snapshot {
  readonly prototypesClassMap = new Map<any, ISnapshotType<any>>();
  readonly prototypesValuesMap = new Map<any, Map<string, ISnapshotValue>>();

  pri: (prototype: object, valueName: string) => void;
  var: (prototype: object, valueName: string) => void;
  req: (prototype: object, valueName: string) => void;
  arr: <T extends new () => any>(
    arrayClass: T
  ) => (prototype: Function) => void;
  obj: (prototype: object) => void;

  _getClassMap(object: { [key: string]: any }) {
    return this.prototypesClassMap.get(object);
  }

  _setClassMap(set: ISnapshotType<any>) {
    this.prototypesClassMap.set(set.prototype, set);
  }

  _getValueMap(object: { [key: string]: any }) {
    return this.prototypesValuesMap.get(object);
  }

  _setValueMap(set: ISnapshotValue) {
    let protoMap = this.prototypesValuesMap.get(set.prototype);
    if (!protoMap) {
      protoMap = new Map();
      this.prototypesValuesMap.set(set.prototype, protoMap);
    }

    protoMap.set(set.name, set);
  }

  setValues(object: { [key: string]: any }, values: { [key: string]: any }) {
    const converter = this._getClassMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return;

    converter.setter(object, values, false);
  }

  createValues(object: { [key: string]: any }, values: { [key: string]: any }) {
    const converter = this._getClassMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return;

    converter.setter(object, values, true);
  }

  getValues(object: { [key: string]: any }) {
    const converter = this._getClassMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return null;

    return converter.getter(object);
  }

  variables(object: { [key: string]: any }) {
    const valuesMap = this._getValueMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!valuesMap) return;

    const result: { [key: string]: any } = {};

    for (let name of valuesMap.keys()) {
      result[name] = object[name];
    }

    return result;
  }

  varsArray<T extends { [key: string]: any }, K extends keyof T>(
    object: T
  ): Array<zzReactive<any>> {
    const valuesMap = this._getValueMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!valuesMap) return [];

    return Array.from(valuesMap.keys()).map((name) => object[name]);
  }

  constructor() {
    this.var = ((prototype: object, valueName: string) => {
      this._setValueMap(
        new ObjectValueDecorator(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.req = ((prototype: object, valueName: string) => {
      this._setValueMap(
        new ObjectRequiedValueDecorator(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.pri = ((prototype: object, valueName: string) => {
      this._setValueMap(
        new ObjectPrimaryValueDecorator(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.arr = (<T extends new () => any>(arrayClass: T) => {
      return (prototype: Function) => {
        this._setClassMap(new ArrayDecorator(this, prototype, arrayClass));
      };
    }).bind(this);

    this.obj = ((prototype: object) => {
      this._setClassMap(new ObjectDecorator(this, prototype));
    }).bind(this);
  }
}
