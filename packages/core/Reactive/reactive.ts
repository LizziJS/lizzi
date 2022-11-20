/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "../Event";
import { zzEventListener, zzSimpleEvent } from "../Event/events";

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

class ReactiveGetEvent extends zzSimpleEvent<
  (variable: zzReactive<any>) => void
> {
  protected listenersMap = new Map<
    (variable: zzReactive<any>) => void,
    zzEventListener<(variable: zzReactive<any>) => void>
  >();

  runIsolated(
    newListener: (variable: zzReactive<any>) => void,
    isolatedFn: () => void
  ) {
    const oldMap = Array.from(this.listenersMap.entries());
    this.listenersMap.clear();

    this.addListener(newListener);

    isolatedFn();

    this.listenersMap.clear();
    this.listenersMap = new Map(oldMap);
  }
}

export const zzReactiveGetObserver = new ReactiveGetEvent();

export const zzValuesObserverIsolator = () => {};

export class zzReactive<TValue> implements IReactive<TValue> {
  readonly onChange = new zzEvent<(event: ValueChangeEvent<TValue>) => void>();
  protected _value: TValue;

  get value(): TValue {
    zzReactiveGetObserver.emit(this);

    return this._value;
  }

  set value(newValue: TValue) {
    if (this._value !== newValue) {
      let ev = new ValueChangeEvent<TValue>(newValue, this._value, this);
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

  constructor(value: TValue) {
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
    zzReactiveGetObserver.emit(this);

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
