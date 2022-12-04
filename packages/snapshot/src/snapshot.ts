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
  ArrayReplaceDecorator,
} from "./decorators";

export class Snapshot {
  readonly prototypesFnClassMap = new Map<Function, any>();
  readonly prototypesClassMap = new Map<any, ISnapshotType<any>>();
  readonly prototypesValuesMap = new Map<any, Map<string, ISnapshotValue>>();

  readonly pri;
  readonly var;
  readonly req;
  readonly array;
  readonly arrayFactory;
  readonly arrayReplace;
  readonly object;

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

    if (!converter)
      throw new Error(
        `not set snapshot decorator for ${
          Object.getPrototypeOf(object).constructor.name
        }`
      );

    converter.setter(object, values, false);
  }

  _createValues(object: any, values: { [key: string]: any }) {
    if (values === undefined) return;

    const converter = this._getClassMap(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter)
      throw new Error(
        `not set snapshot decorator for ${
          Object.getPrototypeOf(object).constructor.name
        }`
      );

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
    const that = this;

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

    this.array = (<ItemT extends new (values: any, object: any) => any>(
      itemType: ItemT
    ) => {
      return <P>(prototype: new (...any: any) => P): any => {
        const decorator = new ArrayDecorator(this, prototype, () => itemType);
        this._setClassMap(decorator);
      };
    }).bind(this);

    this.arrayFactory = (<
      ItemT extends (
        values: any
      ) => new (values: any, object: any) => any | void
    >(
      itemType: ItemT
    ) => {
      return <P>(prototype: new (...any: any) => P): any => {
        const decorator = new ArrayDecorator(this, prototype, itemType);
        this._setClassMap(decorator);
      };
    }).bind(this);

    this.arrayReplace = (<ItemT extends new (values: any, object: any) => any>(
      itemType: ItemT
    ) => {
      return <P>(prototype: new (...any: any) => P): any => {
        const decorator = new ArrayReplaceDecorator(
          this,
          prototype,
          () => itemType
        );
        this._setClassMap(decorator);
      };
    }).bind(this);

    this.object = (<P, C extends object>(
      prototype: new (parent: C) => P
    ): any => {
      const fn = function (values: any, parent: C): P {
        const newClass = new prototype(parent);
        that._createValues(newClass, values);
        return newClass;
      };

      const decorator = new ObjectDecorator(this, prototype);
      this.prototypesFnClassMap.set(fn, decorator);
      this._setClassMap(decorator);

      return fn;
    }).bind(this);
  }
}
