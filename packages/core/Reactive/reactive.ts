/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "../Event";

export class ValueChangeEvent<T> {
  constructor(
    public readonly value: T,
    public readonly last: T,
    public readonly target: zzReactive<T>
  ) {}
}

export type InferReactive<P extends any> = P extends zzReactive<infer T>
  ? T
  : P;

export interface IReactiveEvent<T> {
  readonly onChange: zzEvent<(event: ValueChangeEvent<T>) => void>;
}

export interface IReactiveValue<T> {
  value: T;
}

export type IReactive<T> = IReactiveEvent<T> & IReactiveValue<T>;

export class zzReactive<T> implements IReactive<T> {
  readonly onChange = new zzEvent<(event: ValueChangeEvent<T>) => void>();
  protected _value: T;

  static [Symbol.hasInstance](instance: any) {
    return (
      instance.onChange instanceof zzEvent && instance.hasOwnProperty("value")
    );
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      let ev = new ValueChangeEvent<T>(newValue, this._value, this);
      this._value = newValue;
      this.onChange.emit(ev);
    }
  }

  [Symbol.toPrimitive]() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  constructor(value: T) {
    this._value = value;
  }
}

export class zzType<T> extends zzReactive<T> {
  checkType(value: T): boolean {
    return true;
  }

  protected testValue(newValue: T) {
    if (!this.checkType(newValue)) {
      throw new TypeError(
        newValue + " is not match type " + this.constructor.name
      );
    }
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this.testValue(newValue);

      let ev = new ValueChangeEvent<T>(newValue, this._value, this);
      this._value = newValue;
      this.onChange.emit(ev);
    }
  }

  constructor(value: T) {
    super(value);

    this.testValue(value);
  }
}

export class zzAny extends zzType<any> {}
