/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  DestructorsStack,
  IDestructor,
  zzDestructorsObserver,
} from "../Destructor";
import { zzEvent } from "../Event";
import { zzComputeArray } from "./array";
import { zzCompute } from "./compute";
import {
  EventChangeValue,
  zzReactive,
  zzGetReactiveObserver,
} from "./reactive";

export class EventAddSet<T> {
  constructor(public readonly added: T, public readonly target: zzSet<T>) {}
}

export class EventDeleteSet<T> {
  constructor(public readonly deleted: T, public readonly target: zzSet<T>) {}
}

export class zzSet<T> extends zzReactive<Set<T>> {
  readonly onAdd = new zzEvent<(event: EventAddSet<T>) => void>();
  readonly onDelete = new zzEvent<(event: EventDeleteSet<T>) => void>();

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
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  add(elements: T[]) {
    for (const element of elements) {
      this._value.add(element);
      this.onAdd.emit(new EventAddSet(element, this));
    }
    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  delete(elements: T[]) {
    for (const element of elements) {
      if (this._value.delete(element)) {
        this.onDelete.emit(new EventDeleteSet(element, this));
      }
    }
    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  clear() {
    const lastValue = [...this._value];

    this._value.clear();

    for (const element of lastValue) {
      this.onDelete.emit(new EventDeleteSet(element, this));
    }

    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

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
      addEvent.run(new EventAddSet(element, this))
    );

    destructor.addFunc(() => {
      this.toSet().forEach((element) =>
        removeEvent.run(new EventDeleteSet(element, this))
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
