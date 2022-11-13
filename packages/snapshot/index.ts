/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray, zzReactive } from "@lizzi/core";

interface ISnapshotType<T> {
  readonly prototype: object;
  setter(object: { [key: string]: any }, values: T, isCreated: boolean): void;
  getter(object: { [key: string]: any }): void;
  primaries(): string[];
}

interface ISnapshotValue {
  readonly prototype: object;
  readonly name: string;
  check(value: any): void;
}

class SnapshotObjectType implements ISnapshotType<any> {
  protected snapshot: Snapshot;
  readonly prototype: object;

  primaries() {
    const mapValues = this.snapshot.getValueMap(this.prototype);

    if (!mapValues) return [];

    return Array.from(mapValues.values())
      .filter((value) => value instanceof SnapshotPrimaryValue)
      .map((value) => value.name);
  }

  setter(
    object: { [key: string]: any },
    values: { [key: string]: any },
    checkForRequired: boolean = false
  ) {
    const mapValues = this.snapshot.getValueMap(this.prototype);

    if (!mapValues) return;

    for (const [name, valueChecker] of mapValues) {
      if (checkForRequired) {
        valueChecker.check(values[name]);
      }

      if (values[name] === undefined) continue;

      const rvalue = object[name];

      const proto = this.snapshot.getClassMap(
        Object.getPrototypeOf(rvalue).constructor
      );
      if (proto) {
        this.snapshot.setValues(rvalue, values[name]);

        continue;
      }

      if (rvalue instanceof zzReactive) {
        rvalue.value = values[name];
      }
    }
  }

  getter(object: { [key: string]: any }) {
    const result: { [key: string]: any } = {};

    const mapValues = this.snapshot.getValueMap(this.prototype);

    if (!mapValues) return null;

    for (const [name, valueChecker] of mapValues) {
      const rvalue = object[name];

      const proto = this.snapshot.getClassMap(
        Object.getPrototypeOf(rvalue).constructor
      );
      if (proto) {
        result[name] = this.snapshot.getValues(rvalue);
        continue;
      }

      const value = rvalue instanceof zzReactive ? rvalue.value : rvalue;
      if (value !== undefined) {
        result[name] = value;
      }
    }

    return result;
  }

  constructor(snapshot: Snapshot, prototype: object) {
    this.snapshot = snapshot;
    this.prototype = prototype;
  }
}

class SnapshotValue implements ISnapshotValue {
  protected snapshot: Snapshot;
  readonly prototype: Function;
  readonly name: string;

  check(value: any) {}

  constructor(snapshot: Snapshot, prototype: Function, name: string) {
    this.snapshot = snapshot;
    this.prototype = prototype;
    this.name = name;
  }
}

class SnapshotRequiedValue extends SnapshotValue {
  check(value: any) {
    if (value === undefined)
      throw new TypeError(
        `'${this.name}' value is required for ${this.prototype.name}`
      );
  }
}

class SnapshotPrimaryValue extends SnapshotRequiedValue {
  check(value: any) {
    if (value === undefined)
      throw new TypeError(
        `'${this.name}' value is required for ${this.prototype.name}`
      );
  }
}

class SnapshotArrayType implements ISnapshotType<any> {
  protected snapshot: Snapshot;
  readonly prototype: Function;

  protected arrayClass: new () => any;

  primaries() {
    return [];
  }

  setter(object: zzArray<any>, values: any) {
    if (!Array.isArray(values))
      throw new Error("values isn't array for array object");

    const ids = this.snapshot.getClassMap(this.arrayClass)?.primaries() ?? [];

    if (ids.length === 0)
      throw new Error(this.arrayClass.name + " class hasn't primary id");

    const oldArray = object.toArray();

    const newValues = values.map((newValue: any) => {
      let item = oldArray.find((value) => {
        for (const idName of ids) {
          if (value[idName].value !== newValue[idName]) return false;
        }

        return true;
      });

      if (!item) {
        item = new this.arrayClass();
        this.snapshot.createValues(item!, newValue);
      } else {
        this.snapshot.setValues(item!, newValue);
      }

      return item;
    });

    object.value = newValues;
  }

  getter(valuesArray: { [key: string]: any }[]) {
    return (
      valuesArray instanceof zzArray ? valuesArray.value : valuesArray
    ).map((item) => this.snapshot.getValues(item));
  }

  constructor(
    snapshot: Snapshot,
    prototype: Function,
    arrayClass: new () => any
  ) {
    this.snapshot = snapshot;
    this.prototype = prototype;
    this.arrayClass = arrayClass;
  }
}

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

  getClassMap(object: { [key: string]: any }) {
    return this.prototypesClassMap.get(object);
  }

  setClassMap(set: ISnapshotType<any>) {
    this.prototypesClassMap.set(set.prototype, set);
  }

  setValueMap(set: ISnapshotValue) {
    let protoMap = this.prototypesValuesMap.get(set.prototype);
    if (!protoMap) {
      protoMap = new Map();
      this.prototypesValuesMap.set(set.prototype, protoMap);
    }

    protoMap.set(set.name, set);
  }

  getValueMap(object: { [key: string]: any }) {
    return this.prototypesValuesMap.get(object);
  }

  setValues(object: { [key: string]: any }, values: { [key: string]: any }) {
    const converter = this.prototypesClassMap.get(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return;

    converter.setter(object, values, false);
  }

  createValues(object: { [key: string]: any }, values: { [key: string]: any }) {
    const converter = this.prototypesClassMap.get(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return;

    converter.setter(object, values, true);
  }

  getValues(object: { [key: string]: any }) {
    const converter = this.prototypesClassMap.get(
      Object.getPrototypeOf(object).constructor
    );

    if (!converter) return null;

    return converter.getter(object);
  }

  constructor() {
    this.var = ((prototype: object, valueName: string) => {
      this.setValueMap(
        new SnapshotValue(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.req = ((prototype: object, valueName: string) => {
      this.setValueMap(
        new SnapshotRequiedValue(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.pri = ((prototype: object, valueName: string) => {
      this.setValueMap(
        new SnapshotPrimaryValue(this, prototype.constructor, valueName)
      );
    }).bind(this);

    this.arr = (<T extends new () => any>(arrayClass: T) => {
      return (prototype: Function) => {
        this.setClassMap(new SnapshotArrayType(this, prototype, arrayClass));
      };
    }).bind(this);

    this.obj = ((prototype: object) => {
      this.setClassMap(new SnapshotObjectType(this, prototype));
    }).bind(this);
  }
}
