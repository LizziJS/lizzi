/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray } from "@lizzi/core";
import { Snapshot } from "../snapshot";
import { ISnapshotType } from "./interfaces";

export class ArrayDecorator implements ISnapshotType<any> {
  protected snapshot: Snapshot;
  readonly prototype: Function;

  protected arrayClass: new (values: any, object: any) => any;

  primaries() {
    return [];
  }

  setter(object: zzArray<any>, values: any) {
    if (!Array.isArray(values))
      throw new Error("values isn't array for array object");

    const ids =
      this.snapshot.prototypesFnClassMap.get(this.arrayClass)?.primaries() ??
      [];

    if (ids.length === 0)
      throw new Error(this.arrayClass.name + " class hasn't primary id");

    const oldArray = object.toArray().slice();

    for (let newValue of values) {
      let item = oldArray.find((value) => {
        for (const idName of ids) {
          if (value[idName].value !== newValue[idName]) return false;
        }

        return true;
      });

      if (!item) {
        item = new this.arrayClass(newValue, object);
        object.add([item]);
      } else {
        this.snapshot.setValues(item!, newValue);
      }
    }
  }

  getter(valuesArray: { [key: string]: any }[]) {
    return (
      valuesArray instanceof zzArray ? valuesArray.value : valuesArray
    ).map((item) => this.snapshot.getValues(item));
  }

  constructor(
    snapshot: Snapshot,
    prototype: Function,
    arrayClass: new (values: any, object: any) => any
  ) {
    this.snapshot = snapshot;
    this.prototype = prototype;
    this.arrayClass = arrayClass;
  }
}

export class ArrayReplaceDecorator extends ArrayDecorator {
  setter(object: zzArray<any>, values: any) {
    if (!Array.isArray(values))
      throw new Error("values isn't array for array object");

    const ids =
      this.snapshot.prototypesFnClassMap.get(this.arrayClass)?.primaries() ??
      [];

    if (ids.length === 0)
      throw new Error(this.arrayClass.name + " class hasn't primary id");

    const oldArray = object.toArray().slice();

    object.replace(
      values.map((newValue) => {
        let item = oldArray.find((value) => {
          for (const idName of ids) {
            if (value[idName].value !== newValue[idName]) return false;
          }

          return true;
        });

        if (!item) {
          item = new this.arrayClass(newValue, object);
        } else {
          this.snapshot.setValues(item!, newValue);
        }

        return item;
      })
    );
  }
}
