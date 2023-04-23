/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue, zzReactive } from "./reactive";
import { zzGetReactiveObserver } from "./observer";
import { DestructorsStack } from "../Destructor";

export class zzComputeFn<T> extends zzReactive<T> {
  protected _fn: () => T;
  protected _destructor = new DestructorsStack();

  destroy(): void {
    super.destroy();
    this._destructor.destroy();
  }

  protected _isolate() {
    this._destructor.destroy();

    this._destructor.add(
      zzGetReactiveObserver.catch(
        () => {
          const lastValue = this._value;

          this._value = this._fn.apply(this);

          if (lastValue !== this._value) {
            zzGetReactiveObserver.runIsolated(() => {
              this.onChange.emit(
                new EventChangeValue(this._value, lastValue, this)
              );
            });
          }
        },
        () => this._isolate()
      )
    );
  }

  get value() {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  private set value(set: T) {
    throw new SyntaxError("You can not set compute value");
  }

  constructor(fn: () => T) {
    super(undefined as any);

    this._fn = fn;

    this._isolate();
  }
}

export function zzCompute<T>(fn: (...args: any) => T) {
  return new zzComputeFn(fn);
}
