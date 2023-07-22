/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  EventChangeValue,
  zzGetReactiveObserver,
  zzReactive,
} from "./reactive";

export class zzType<T> extends zzReactive<T> {
  protected readonly _typeValidators: ((value: any) => boolean)[] = [];

  addValidator(fn: (value: any) => boolean) {
    this._typeValidators.push(fn);

    return this;
  }

  protected checkValueTypes(newValue: T) {
    try {
      if (!this._typeValidators.every((fn) => fn(newValue))) {
        throw new TypeError(
          newValue + " is not match type " + this.constructor.name
        );
      }
    } catch (error: any) {
      throw new TypeError(error.message);
    }

    return true;
  }

  get value(): T {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue && this.checkValueTypes(newValue)) {
      let ev = new EventChangeValue<T>(newValue, this._value, this);
      this._value = newValue;

      this.onChange.emit(ev);
    }
  }

  constructor(value: T) {
    super(value);

    this.checkValueTypes(value);
  }
}

export class zzAny extends zzType<any> {}
