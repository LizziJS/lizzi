/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ReactiveEventChange } from "../reactive";
import {
  IReadOnlyMap,
  ReactiveMapEventSet,
  zzReadonlyMap,
} from "./readonlyMap";

export interface IWriteOnlyMap<TKey, TValue> {
  set(key: TKey, element: TValue): this;
  delete(key: TKey): this;
  clear(): this;
}

export class zzMap<TKey, TValue>
  extends zzReadonlyMap<TKey, TValue>
  implements IWriteOnlyMap<TKey, TValue>
{
  set(key: TKey, element: TValue) {
    const lastValue = this._value.get(key);

    if (lastValue !== element) {
      this._value.set(key, element);

      this.onSet.emit(new ReactiveMapEventSet(element, lastValue, key, this));

      this.onChange.emit(
        new ReactiveEventChange(this._value, this._value, this)
      );
    }

    return this;
  }

  delete(key: TKey) {
    if (this._value.has(key)) {
      const lastValue = this._value.get(key);

      this._value.delete(key);

      this.onSet.emit(new ReactiveMapEventSet(undefined, lastValue, key, this));

      this.onChange.emit(
        new ReactiveEventChange(this._value, this._value, this)
      );
    }

    return this;
  }

  clear() {
    const entries = [...this._value.entries()];

    this._value.clear();

    for (const [key, value] of entries) {
      this.onSet.emit(new ReactiveMapEventSet(undefined, value, key, this));
    }

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  readonly() {
    return this as IReadOnlyMap<TKey, TValue>;
  }
}
