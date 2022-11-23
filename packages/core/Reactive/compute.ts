/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  IReactiveEvent,
  ValueChangeEvent,
  zzReactive,
  zzReactiveGetObserver,
} from "./reactive";
import { DestructorsStack, IDestructor } from "../Destructor";
import { onStartListening, zzEvent } from "../Event";
import { zzComputeArrayFn } from "./array";
import { DestructorFn } from "../Event/events";

export class zzComputeFn<T> extends zzReactive<T> implements IDestructor {
  protected _fn: () => T;
  protected eventObserver;

  destroy() {
    this.eventObserver.destroy();
  }

  get value() {
    zzReactiveGetObserver.emit(this);

    if (!this.eventObserver.isWatching) {
      this._value = this._fn.apply(this);
    }

    return this._value;
  }

  private set value(set: T) {
    throw new SyntaxError("You can not set compute value");
  }

  constructor(
    fn: () => T,
    ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
  ) {
    super(undefined as any);

    this._fn = fn;

    this.eventObserver = onStartListening(() => {
      const checkChange = () => {
        let newValue: T;

        isolator.isolate(() => {
          newValue = this._fn.apply(this);
        });

        if (this._value !== newValue!) {
          let ev = new ValueChangeEvent<T>(newValue!, this._value, this);
          this._value = newValue!;
          this.onChange.emit(ev);
        }
      };

      const isolator = zzReactiveGetObserver.createIsolator(checkChange);

      isolator.isolate(() => {
        this._value = this._fn.apply(this);
      });

      const eventsStack = new DestructorsStack(isolator);

      for (let varOrEvent of dependencies) {
        if (varOrEvent instanceof zzEvent) {
          eventsStack.add(varOrEvent.addListener(checkChange));
        } else if (varOrEvent.onChange instanceof zzEvent) {
          eventsStack.add(varOrEvent.onChange.addListener(checkChange));
        }
      }

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
export const zzC = zzCompute;

export function zzComputeArray<T>(
  fn: () => Array<T>,
  ...dependencies: (zzReactive<any> | zzEvent<any>)[]
) {
  return new zzComputeArrayFn(fn, ...dependencies);
}

export const zzMemoArray = zzComputeArray;
export const zzA = zzComputeArray;
