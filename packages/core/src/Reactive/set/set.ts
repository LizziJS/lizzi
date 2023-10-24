/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IWriteOnlyReactive, ReactiveEventChange } from "../reactive";
import {
  IReadOnlySet,
  ReactiveSetEventAdd,
  ReactiveSetEventDelete,
  zzReadonlySet,
} from "./readonlySet";

export interface IWriteOnlySet<T> extends IWriteOnlyReactive<Set<T>> {
  add(elements: T[]): this;
  delete(elements: T[]): this;
  clear(): this;
}

export class zzSet<T> extends zzReadonlySet<T> implements IWriteOnlySet<T> {
  add(elements: T[]) {
    for (const element of elements) {
      this._value.add(element);
      this.onAdd.emit(new ReactiveSetEventAdd(element, this));
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  delete(elements: T[]) {
    for (const element of elements) {
      if (this._value.delete(element)) {
        this.onDelete.emit(new ReactiveSetEventDelete(element, this));
      }
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  clear() {
    const lastValue = [...this._value];

    this._value.clear();

    for (const element of lastValue) {
      this.onDelete.emit(new ReactiveSetEventDelete(element, this));
    }

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  readonly(): IReadOnlySet<T> {
    return this;
  }
}
