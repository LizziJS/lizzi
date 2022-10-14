/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ValueChangeEvent, zzType } from "./reactive";
import { IDestructor } from "../Destructor";
import { zzCompute } from "./compute";

export class zzObject<T> extends zzType<T | null> {
  setItemListener(fn: (item: T) => IDestructor) {
    let toDestroy: IDestructor | null = null;

    return this.onChange
      .addListener((ev) => {
        if (toDestroy !== null) {
          toDestroy.destroy();
          toDestroy = null;
        }

        if (ev.value !== null) {
          toDestroy = fn(ev.value);
        }
      })
      .run(new ValueChangeEvent(this.value, null, this));
  }

  checkType(value: T | null) {
    return typeof value === "object";
  }

  getValue(name: keyof T) {
    return zzCompute(() => (this.value ? this.value[name] : undefined), this);
  }
}

export const zzObj = zzObject;
