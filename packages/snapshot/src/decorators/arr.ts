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

  protected getConstructorFn: (
    values: any
  ) => new (values: any, object: any) => any | undefined;

  primaries() {
    return [];
  }

  setter(object: zzArray<any>, values: any) {
    if (!Array.isArray(values))
      throw new Error("values isn't array for array object");

    const oldArray = object.toArray().slice();

    for (let newValue of values) {
      const itemConstructor = this.getConstructorFn(values);

      if (!itemConstructor)
        throw new Error("No class constructor for " + values);

      const ids =
        this.snapshot.prototypesFnClassMap.get(itemConstructor)?.primaries() ??
        [];

      if (ids.length === 0)
        throw new Error(itemConstructor.name + " class hasn't primary id");

      let item = oldArray.find((value) => {
        for (const idName of ids) {
          if (value[idName].value !== newValue[idName]) return false;
        }

        return true;
      });

      if (!item) {
        item = new itemConstructor(newValue, object);
        object.add([item]);
      } else {
        this.snapshot.setValues(item!, newValue);
      }
    }
  }

  getter(valuesArray: { [key: string]: any }[]) {
    return (zzArray.isArray(valuesArray) ? valuesArray.value : valuesArray).map(
      (item) => this.snapshot.getValues(item)
    );
  }

  constructor(
    snapshot: Snapshot,
    prototype: Function,
    arrayClass: (
      values: any
    ) => new (values: any, object: any) => any | undefined
  ) {
    this.snapshot = snapshot;
    this.prototype = prototype;
    this.getConstructorFn = arrayClass;
  }
}

export class ArrayReplaceDecorator extends ArrayDecorator {
  setter(object: zzArray<any>, values: any) {
    if (!Array.isArray(values))
      throw new Error("values isn't array for array object");

    const oldArray = object.toArray().slice();

    object.replace(
      values.map((newValue) => {
        const itemConstructor = this.getConstructorFn(values);

        if (!itemConstructor)
          throw new Error("No class constructor for " + values);

        const ids =
          this.snapshot.prototypesFnClassMap
            .get(itemConstructor)
            ?.primaries() ?? [];

        if (ids.length === 0)
          throw new Error(itemConstructor.name + " class hasn't primary id");

        let item = oldArray.find((value) => {
          for (const idName of ids) {
            if (value[idName].value !== newValue[idName]) return false;
          }

          return true;
        });

        if (!item) {
          item = new itemConstructor(newValue, object);
        } else {
          this.snapshot.setValues(item!, newValue);
        }

        return item;
      })
    );
  }
}
