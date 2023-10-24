/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  IReadOnlyReactive,
  IWriteOnlyReactive,
  ReactiveEventChange,
  zzReactive,
  zzReactiveValueGetObserver,
} from "./reactive";

export interface ITypedReactive<T> {
  addValidator(fn: (value: T) => boolean): this;
}

export class zzType<T>
  extends zzReactive<T>
  implements ITypedReactive<T>, IWriteOnlyReactive<T>, IReadOnlyReactive<T>
{
  protected readonly _typeValidators: ((value: any) => boolean)[] = [];

  constructor(value: T) {
    super(value);

    this.checkValueTypes(value);
  }

  addValidator(fn: (value: T) => boolean) {
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
    zzReactiveValueGetObserver.add(this);

    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue && this.checkValueTypes(newValue)) {
      let ev = new ReactiveEventChange(newValue, this._value, this);
      this._value = newValue;

      this.onChange.emit(ev);
    }
  }
}

export class zzAny extends zzType<any> {}
