/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "../Event";
import { IDestructor, zzEventListener, zzSimpleEvent } from "../Event/events";

export class ValueChangeEvent<T> {
  static run<R extends zzReactive<any>>(target: R) {
    return new ValueChangeEvent(target.value, target.value, target);
  }

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

export class RGetObserverIsolator implements IDestructor {
  protected onChange: () => void;
  protected variableStack = new Set<zzReactive<any>>();

  stackCount() {
    return this.variableStack.size;
  }

  destroy() {
    for (const variable of this.variableStack) {
      variable.onChange.removeListener(this.onChange);
    }
  }

  isolate(isolatedFn: () => void) {
    const newVariableStack = new Set<zzReactive<any>>();

    zzReactiveGetObserver.runIsolated((variable) => {
      newVariableStack.add(variable);

      if (!this.variableStack.delete(variable)) {
        // if is new element
        variable.onChange.addListener(this.onChange);
      }
    }, isolatedFn);

    // left variables to remove
    for (const variable of this.variableStack) {
      variable.onChange.removeListener(this.onChange);
    }

    this.variableStack = newVariableStack;
  }

  constructor(onChange: () => void) {
    this.onChange = onChange;
  }
}

class ReactiveGetEvent extends zzSimpleEvent<
  (variable: zzReactive<any>) => void
> {
  protected listenersMap = new Map<
    (variable: zzReactive<any>) => void,
    zzEventListener<(variable: zzReactive<any>) => void>
  >();

  protected isolateState(isolatedFn: () => void) {
    const oldMap = Array.from(this.listenersMap.entries());
    this.listenersMap.clear();

    isolatedFn();

    this.listenersMap = new Map(oldMap);
  }

  runIsolated(
    newListener: (variable: zzReactive<any>) => void,
    isolatedFn: () => void
  ) {
    this.isolateState(() => {
      this.addListener((variable: zzReactive<any>) => {
        this.isolateState(() => {
          newListener(variable);
        });
      });

      isolatedFn();
    });
  }

  createIsolator(onChange: () => void) {
    return new RGetObserverIsolator(onChange);
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
