/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray, zzReactive } from "@lizzi/core";
import { Snapshot } from "../snapshot";
import { ISnapshotType, ISnapshotValue } from "./interfaces";

export class ObjectDecorator implements ISnapshotType<any> {
  protected snapshot: Snapshot;
  readonly prototype: object;
  protected _primaries: null | string[] = null;

  primaries() {
    if (this._primaries === null) {
      const mapValues = this.snapshot._getValueMap(this.prototype);

      if (!mapValues) return [];

      this._primaries = Array.from(mapValues.values())
        .filter((value) => value instanceof ObjectPrimaryValueDecorator)
        .map((value) => value.name);
    }

    return this._primaries;
  }

  setter(
    object: { [key: string]: any },
    values: { [key: string]: any },
    checkForRequired: boolean = false
  ) {
    const mapValues = this.snapshot._getValueMap(this.prototype);

    if (!mapValues) return;

    for (const [name, valueChecker] of mapValues) {
      if (checkForRequired) {
        valueChecker.check(values[name]);
      }

      if (values[name] === undefined) continue;

      const rvalue = object[name];

      const proto = this.snapshot._getClassMap(
        Object.getPrototypeOf(rvalue).constructor
      );
      if (proto) {
        this.snapshot.setValues(rvalue, values[name]);

        continue;
      } else if (rvalue instanceof zzArray) {
        throw Error(
          `.array(...) decorator for class ${
            Object.getPrototypeOf(rvalue).constructor.name
          } should be set`
        );
      }

      if (rvalue instanceof zzReactive) {
        rvalue.value = values[name];
      }
    }
  }

  getter(object: { [key: string]: any }) {
    const result: { [key: string]: any } = {};

    const mapValues = this.snapshot._getValueMap(this.prototype);

    if (!mapValues) return null;

    for (const name of mapValues.keys()) {
      const rvalue = object[name];

      const proto = this.snapshot._getClassMap(
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

export class ObjectValueDecorator implements ISnapshotValue {
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

export class ObjectRequiedValueDecorator extends ObjectValueDecorator {
  check(value: any) {
    if (value === undefined)
      throw new TypeError(
        `'${this.name}' value is required for ${this.prototype.name}`
      );
  }
}

export class ObjectPrimaryValueDecorator extends ObjectRequiedValueDecorator {
  check(value: any) {
    if (value === undefined)
      throw new TypeError(
        `'${this.name}' value is required for ${this.prototype.name}`
      );
  }
}
