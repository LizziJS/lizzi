/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IReactiveEvent, ValueChangeEvent, zzReactive } from "./reactive";
import { DestructorsStack, IDestructor } from "../Destructor";
import { onStartListening, zzEvent } from "../Event";
import { zzComputeArrayFn } from "./array";

export class zzComputeFn<T> extends zzReactive<T> implements IDestructor {
  protected _fn: () => T;
  protected eventObserver;

  destroy() {
    this.eventObserver.destroy();
  }

  get value() {
    return this._fn.apply(this);
  }

  private set value(set: T) {
    throw new SyntaxError("You can not set compute value");
  }

  protected checkChange() {
    let newValue = this.value;

    if (this._value !== newValue) {
      let ev = new ValueChangeEvent<T>(newValue, this._value, this);
      this._value = newValue;
      this.onChange.emit(ev);
    }
  }

  constructor(
    fn: () => T,
    ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
  ) {
    super(fn());

    this._fn = fn;

    this.eventObserver = onStartListening(() => {
      const eventsStack = new DestructorsStack();

      for (let varOrEvent of dependencies) {
        if (varOrEvent instanceof zzEvent) {
          eventsStack.add(varOrEvent.addListener(() => this.checkChange()));
        } else if (varOrEvent.onChange instanceof zzEvent) {
          eventsStack.add(
            varOrEvent.onChange.addListener(() => this.checkChange())
          );
        }
      }

      this._value = this.value;

      return eventsStack;
    }, this.onChange);
  }
}

export function zzCompute<T>(
  fn: (...args: any) => T,
  ...dependencies: (zzReactive<any> | zzEvent<any>)[]
) {
  return new zzComputeFn(fn, ...dependencies);
}

export const zzMemo = zzCompute;
export const zzF = zzCompute;

export function zzComputeArray<T>(
  fn: () => Array<T>,
  ...dependencies: (zzReactive<any> | zzEvent<any>)[]
) {
  return new zzComputeArrayFn(fn, ...dependencies);
}

export const zzMemoArray = zzComputeArray;
