/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  ReactiveEventChange,
  zzReactiveValueGetObserver,
  zzReadonly,
} from "./reactive";
import { DestructorsStack } from "../Destructor";

export class zzComputeFn<T> extends zzReadonly<T> {
  protected _fn: () => T;
  protected _destructor = new DestructorsStack();

  destroy(): void {
    super.destroy();
    this._destructor.destroy();
  }

  protected _isolate() {
    this._destructor.destroy();

    this._destructor.add(
      zzReactiveValueGetObserver.catch(
        () => {
          const lastValue = this._value;

          this._value = this._fn.apply(this);

          if (lastValue !== this._value) {
            zzReactiveValueGetObserver.runIsolated(() => {
              this.onChange.emit(
                new ReactiveEventChange(this._value, lastValue, this)
              );
            });
          }
        },
        () => this._isolate()
      )
    );
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
