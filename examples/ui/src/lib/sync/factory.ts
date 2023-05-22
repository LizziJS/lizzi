/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray, zzReactive } from "@lizzi/core";
import { zzSync } from "./sync";
import { v4 } from "uuid";

export class zzSyncFactory {
  readonly mapNamePrototype = new Map<string, new (...args: any) => any>();
  readonly mapPrototypeName = new Map<new (...args: any) => any, string>();
  readonly prototypesValuesMap = new Map<
    new (...args: any) => any,
    Set<string>
  >();

  readonly autoSyncValuesMap = new Map<
    new (...args: any) => any,
    Set<string>
  >();

  readonly store: zzSync<any>;
  readonly autosync;
  readonly var;
  readonly object;

  constructor(store: zzSync<any>) {
    this.store = store;

    this.var = ((prototype: object, valueName: string) => {
      this._setValueSet(prototype.constructor as any, valueName);
    }).bind(this);

    this.object = (name?: string) =>
      (<Q, P extends new (...args: any) => Q>(prototype: P) => {
        this.mapNamePrototype.set(name ?? prototype.name, prototype);
        this.mapPrototypeName.set(prototype, name ?? prototype.name);

        return prototype;
      }).bind(this);

    this.autosync = ((prototype: object, valueName: string) => {
      this._setSyncAutoSet(prototype as any, valueName);
    }).bind(this);

    this.store.onSync.addListener((item) => {
      Array.from(this._getSyncAutoSet(item) ?? []).map((name) => {
        this.autoSync(item[name as keyof any] as any);
      });
    });
  }

  getType(object: { [key: string]: any }) {
    return this.mapPrototypeName.get(Object.getPrototypeOf(object).constructor);
  }

  protected _getValueSet(object: { [key: string]: any }) {
    return this.prototypesValuesMap.get(
      Object.getPrototypeOf(object).constructor
    );
  }

  protected _setValueSet(prototype: new (...args: any) => any, name: string) {
    let protoMap = this.prototypesValuesMap.get(prototype);
    if (!protoMap) {
      protoMap = new Set();
      this.prototypesValuesMap.set(prototype, protoMap);
    }

    protoMap.add(name);
  }

  getKeys(object: { [key: string]: any }) {
    return Array.from(this._getValueSet(object)?.keys() ?? []).map(
      (key) => object[key]
    );
  }

  setValues(object: { [key: string]: any }, values: { [key: string]: any }) {
    const valueNames = this._getValueSet(object);

    if (!valueNames) return object;

    for (const name of valueNames) {
      if (name in values) {
        if (zzReactive.isReactive(object[name])) {
          object[name].value = values[name];
        }
      }
    }

    return object;
  }

  getValues(object: { [key: string]: any }) {
    const valueNames = this._getValueSet(object);

    if (!valueNames) throw new TypeError();

    const result: { [key: string]: any } = {};

    for (const name of valueNames) {
      result[name] = zzReactive.isReactive(object[name])
        ? object[name].value
        : object[name];
    }

    return result;
  }

  create(objectName: string) {
    const proto = this.mapNamePrototype.get(objectName);
    if (proto) {
      return new proto();
    }

    throw new Error(`Can't find object name ${objectName}`);
  }

  protected _setSyncAutoSet(
    prototype: new (...args: any) => any,
    name: string
  ) {
    let protoMap = this.autoSyncValuesMap.get(prototype);
    if (!protoMap) {
      protoMap = new Set();
      this.autoSyncValuesMap.set(prototype, protoMap);
    }

    protoMap.add(name);
  }

  protected _getSyncAutoSet(object: { [key: string]: any }) {
    return this.autoSyncValuesMap.get(Object.getPrototypeOf(object));
  }

  autoSync<T>(item: T, newIdGenFn: (item: T) => string = () => v4()): T {
    if (zzArray.isArray(item)) {
      item.itemsListener(
        (item) => {
          if (this.getType(item) === undefined)
            throw new TypeError(
              `Can't find type for class ${item.constructor.name}, please initialize type with @factory.object(type)`
            );

          this.store.sync(item, newIdGenFn(item));
        },
        (item) => {
          this.store.remove(item);
        }
      );
    } else if (zzReactive.isReactive(item)) {
      item.onChange.addListener((ev) => {
        if (ev.last) {
          this.store.remove(ev.last);
        }

        if (ev.value) {
          if (this.getType(ev.value) === undefined)
            throw new TypeError(
              `Can't find type for class ${ev.value.constructor.name}, please initialize type with @factory.object(type)`
            );

          this.store.sync(ev.value, newIdGenFn(ev.value));
        }
      });
    }

    return item;
  }
}
