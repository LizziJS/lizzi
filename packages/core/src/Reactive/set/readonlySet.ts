/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  DestructorsStack,
  IDestructor,
  zzDestructorsObserver,
} from "../../Destructor";
import { zzEvent } from "../../Event";
import { zzComputeArray } from "../array/compute";
import { IReadOnlyArray } from "../array/readonlyArray";
import { zzCompute } from "../compute";
import {
  IReadOnlyReactive,
  ReactiveEventChange,
  zzReactiveValueGetObserver,
  zzReadonly,
} from "../reactive";

export interface IReactiveSetEventAdd<TValue> {
  added: TValue;
  target: zzReadonlySet<TValue>;
}

export class ReactiveSetEventAdd<T> implements IReactiveSetEventAdd<T> {
  constructor(
    public readonly added: T,
    public readonly target: zzReadonlySet<T>
  ) {}
}

export interface IReactiveSetEventDelete<TValue> {
  deleted: TValue;
  target: zzReadonlySet<TValue>;
}

export class ReactiveSetEventDelete<T> implements IReactiveSetEventDelete<T> {
  constructor(
    public readonly deleted: T,
    public readonly target: zzReadonlySet<T>
  ) {}
}

export interface IReadOnlySet<T> extends IReadOnlyReactive<Set<T>> {
  readonly onAdd: zzEvent<(event: ReactiveSetEventAdd<T>) => void>;
  readonly onDelete: zzEvent<(event: ReactiveSetEventDelete<T>) => void>;
  toSet(): Set<T>;
  has(element: T): IReadOnlyReactive<boolean>;
  values(): IReadOnlyArray<T>;
  itemsListener(
    addFn: (item: T, set: this) => IDestructor | void,
    removeFn?: (item: T, set: this) => void
  ): this;
  get size(): number;
}

export class zzReadonlySet<T>
  extends zzReadonly<Set<T>>
  implements IReadOnlySet<T>
{
  readonly onAdd = new zzEvent<(event: ReactiveSetEventAdd<T>) => void>();
  readonly onDelete = new zzEvent<(event: ReactiveSetEventDelete<T>) => void>();

  destroy(): void {
    super.destroy();
    this.onAdd.destroy();
    this.onDelete.destroy();
  }

  *[Symbol.iterator]() {
    for (let el of this.toSet()) {
      yield el;
    }
  }

  toSet() {
    zzReactiveValueGetObserver.add(this);

    return this._value;
  }

  protected add(elements: T[]) {
    for (const element of elements) {
      this._value.add(element);
      this.onAdd.emit(new ReactiveSetEventAdd(element, this));
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  protected delete(elements: T[]) {
    for (const element of elements) {
      if (this._value.delete(element)) {
        this.onDelete.emit(new ReactiveSetEventDelete(element, this));
      }
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  protected clear() {
    const lastValue = [...this._value];

    this._value.clear();

    for (const element of lastValue) {
      this.onDelete.emit(new ReactiveSetEventDelete(element, this));
    }

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  itemsListener(
    addFn: (item: T, set: this) => IDestructor | void,
    removeFn: (item: T, set: this) => void = () => {}
  ) {
    const destructionMap = new Map<T, IDestructor>();

    const addEvent = this.onAdd.addListener((ev) => {
      const toDestroy = zzDestructorsObserver.catch(() =>
        addFn.call(this, ev.added, this)
      );

      if (toDestroy.size > 0) {
        destructionMap.set(ev.added, toDestroy);
      }
    });

    const removeEvent = this.onDelete.addListener((ev) => {
      const toDestroy = destructionMap.get(ev.deleted);
      if (toDestroy) {
        toDestroy.destroy();
        destructionMap.delete(ev.deleted);
      }

      removeFn.call(this, ev.deleted, this);
    });

    const destructor = new DestructorsStack(addEvent, removeEvent);

    this.toSet().forEach((element) =>
      addEvent.run(new ReactiveSetEventAdd(element, this))
    );

    destructor.addFunc(() => {
      this.toSet().forEach((element) =>
        removeEvent.run(new ReactiveSetEventDelete(element, this))
      );
    });

    return this;
  }

  has(element: T) {
    return zzCompute(() => this.value.has(element));
  }

  values() {
    return zzComputeArray(() => [...this.toSet()]);
  }

  get size() {
    return this.toSet().size;
  }

  get value() {
    return this.toSet();
  }

  constructor(value: T[] = []) {
    super(new Set(value));
  }
}
