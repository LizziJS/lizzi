/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zzReactive,
  EventChangeValue,
  zzGetReactiveObserver,
  IReadOnlyReactive,
  IWriteOnlyReactive,
} from "./reactive";
import {
  DestructorsStack,
  IDestructor,
  zzDestructorsObserver,
} from "../Destructor";
import { zzEvent } from "../Event";
import { zzCompute } from "./compute";

export class EventAddArray<T> {
  constructor(
    public readonly added: T,
    public readonly index: number,
    public readonly target: zzReadonlyArray<T>
  ) {}
}

export class EventRemoveArray<T> {
  constructor(
    public readonly removed: T,
    public readonly index: number,
    public readonly target: zzReadonlyArray<T>
  ) {}
}

export interface IReadOnlyArray<T> extends IReadOnlyReactive<T[]> {
  readonly onAdd: zzEvent<(event: EventAddArray<T>) => void>;
  readonly onRemove: zzEvent<(event: EventRemoveArray<T>) => void>;
  toArray(): T[];
}

export interface IWriteOnlyArray<T> extends IWriteOnlyReactive<T[]> {
  readonly length: number;

  add(elements: T[], index?: number): this;
  addBefore(elements: T[], before: T): this;
  addAfter(elements: T[], after: T): this;

  remove(elements: T[]): this;
  removeByIndex(index: number): this;
  removeAll(): this;

  has(element: T): boolean;
  replace(newElements: T[]): this;
}

export interface IHelpersArray<T> {
  itemsListener(
    addFn: (item: T, array: this) => IDestructor | void,
    removeFn: (item: T, array: this) => void
  ): IHelpersArray<T>;

  filter(
    filterFn: (value: T, index: number, array: this) => boolean,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ): zzReadonlyArray<T>;

  includes(value: T | zzReactive<T>): zzReactive<boolean>;

  find(
    findFn: (value: T, index: number, array: this) => boolean,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ): zzReactive<T | undefined>;

  sort(
    sortFn: (a: T, b: T) => number,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ): zzReadonlyArray<T>;

  join(join: zzReactive<string>): zzReactive<string>;

  map<NewT>(
    mapFn: (value: T, self: zzReadonlyArray<T>) => NewT
  ): zzReadonlyArray<NewT>;
}

export type IArray<T> = IReadOnlyArray<T> &
  IWriteOnlyArray<T> &
  IHelpersArray<T>;

export class zzReadonlyArray<T>
  extends zzReactive<T[]>
  implements IReadOnlyArray<T>, IHelpersArray<T>
{
  readonly onAdd = new zzEvent<(event: EventAddArray<T>) => void>();
  readonly onRemove = new zzEvent<(event: EventRemoveArray<T>) => void>();

  static isArray(check: any): check is zzReadonlyArray<any> {
    return (
      check &&
      zzEvent.isEvent(check.onAdd) &&
      zzEvent.isEvent(check.onRemove) &&
      zzReactive.isReactive(check)
    );
  }

  destroy(): void {
    super.destroy();
    this.onAdd.destroy();
    this.onRemove.destroy();
  }

  *[Symbol.iterator]() {
    for (let el of this.toArray()) {
      yield el;
    }
  }

  toArray() {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  get length() {
    return this.toArray().length;
  }

  get value() {
    return this.toArray();
  }

  /* helpers */
  itemsListener(
    addFn: (item: T, array: this) => void,
    removeFn: (item: T, array: this) => void = () => {}
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

    const removeEvent = this.onRemove.addListener((ev) => {
      const toDestroy = destructionMap.get(ev.removed);
      if (toDestroy) {
        toDestroy.destroy();
        destructionMap.delete(ev.removed);
      }
      removeFn.call(this, ev.removed, this);
    });

    const destructor = new DestructorsStack(addEvent, removeEvent);

    this.toArray().forEach((element, index) =>
      addEvent.run(new EventAddArray(element, index, this))
    );

    destructor.addFunc(() => {
      this.toArray().forEach((element) =>
        removeEvent.run(new EventRemoveArray(element, 0, this))
      );
    });

    return this;
  }

  filter(filterFn: (value: T, index: number, array: this) => boolean) {
    return new zzComputeArrayFn(() =>
      this.toArray().filter((value, index) => filterFn(value, index, this))
    );
  }

  includes(value: T | zzReactive<T>) {
    if (zzReactive.isReactive(value)) {
      return zzCompute(() => this.toArray().includes(value.value));
    }

    return zzCompute(() => this.toArray().includes(value as T));
  }

  find(findFn: (value: T, index: number, array: this) => boolean) {
    return zzCompute(() =>
      this.toArray().find((value, index) => findFn(value, index, this))
    );
  }

  sort(sortFn: (a: T, b: T) => number) {
    return new zzComputeArrayFn(() => this.toArray().slice().sort(sortFn));
  }

  join(join: zzReactive<string>) {
    const joinedString = zzCompute(() => this.value.join(join.value));

    return joinedString;
  }

  map<NewT>(mapFn: (value: T, self: zzReadonlyArray<T>) => NewT) {
    return new zzArrayMap<T, NewT>(this, mapFn);
  }

  compute<NewT>(computeFn: (array: T[]) => NewT[]) {
    return new zzComputeArrayFn(() => computeFn(this.toArray()));
  }

  flat() {
    return new zzArrayFlat(this as any);
  }

  readonly() {
    return this as IReadOnlyArray<T>;
  }
}

export class zzArray<T>
  extends zzReadonlyArray<T>
  implements IWriteOnlyArray<T>
{
  static isArray(check: any): check is zzArray<any> {
    return (
      check &&
      typeof check.add === "function" &&
      typeof check.remove === "function" &&
      zzReadonlyArray.isArray(check)
    );
  }

  add(elements: T[], index?: number) {
    index === undefined && (index = this._value.length);

    // this._value.splice(index, 0, ...elements);
    safeInsertToArray(this._value, index, elements);

    for (let i = 0; i < elements.length; i++) {
      this.onAdd.emit(new EventAddArray(elements[i], index + i, this));
    }
    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  addBefore(elements: T[], before: T) {
    let idx = this._value.indexOf(before);
    if (idx === -1) {
      return this;
    }

    return this.add(elements, idx);
  }

  addAfter(elements: T[], after: T) {
    let idx = this._value.indexOf(after);
    if (idx === -1) {
      return this;
    }

    return this.add(elements, idx + 1);
  }

  removeAll() {
    const last = this._value;

    this._value = [];

    for (let k = 0; k < last.length; k++) {
      this.onRemove.emit(new EventRemoveArray(last[k], 0, this));
    }
    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  remove(elements: T[]) {
    for (let d of elements) {
      let idx = this._value.indexOf(d);
      if (idx !== -1) {
        const removed = this._value.splice(idx, 1);
        this.onRemove.emit(new EventRemoveArray(removed[0], idx, this));
      }
    }

    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  removeByIndex(index: number) {
    const removed = this._value.splice(index, 1);

    if (removed.length > 0) {
      this.onRemove.emit(new EventRemoveArray(removed[0], index, this));
      this.onChange.emit(new EventChangeValue(this._value, this._value, this));
    }

    return this;
  }

  has(element: T) {
    return this._value.includes(element);
  }

  protected _silentReplace(newElements: T[]) {
    let currentIndex = 0;
    let deletedItems = 0;
    const array = this._value;
    this._value = newElements.slice();

    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index !== -1) {
        for (let k = currentIndex; k < index; k++) {
          this.onRemove.emit(
            new EventRemoveArray(array[k], currentIndex - deletedItems, this)
          );
        }

        deletedItems += index - currentIndex;
        currentIndex = index + 1;
      }
    }

    //remove all last elements
    for (let k = currentIndex; k < array.length; k++) {
      this.onRemove.emit(
        new EventRemoveArray(array[k], currentIndex - deletedItems, this)
      );
    }

    //add new elements
    currentIndex = 0;
    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index === -1) {
        this.onAdd.emit(new EventAddArray(newElements[i], i, this));
      } else {
        currentIndex = index + 1;
      }
    }
  }

  replace(newElements: T[]) {
    this._silentReplace(newElements);

    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  refresh() {
    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  toArray() {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  get value() {
    return this.toArray();
  }

  set value(newElements: T[]) {
    this.replace(newElements);
  }

  constructor(array: T[] = []) {
    super(array.slice());
  }
}

const MIN_SPLIT_ARRAY_SIZE = 10000;
export const safeInsertToArray = <T>(
  array: T[],
  index: number,
  elements: T[]
) => {
  if (elements.length <= MIN_SPLIT_ARRAY_SIZE) {
    array.splice(index, 0, ...elements);
    return;
  }

  for (let i = 0; i < elements.length; i += MIN_SPLIT_ARRAY_SIZE) {
    array.splice(index + i, 0, ...elements.slice(i, i + MIN_SPLIT_ARRAY_SIZE));
  }
};

export class zzArrayMap<T, NewT> extends zzReadonlyArray<NewT> {
  protected readonly destructorMap = new Map<T, IDestructor>();
  protected _destructor = new DestructorsStack();
  protected sourceArray: zzReadonlyArray<T>;

  destroy(): void {
    super.destroy();
    this._destructor.destroy();

    this.destructorMap.forEach((destructor) => destructor.destroy());
  }

  protected add(elements: NewT[], index?: number) {
    index === undefined && (index = this._value.length);

    //this._value.splice(index, 0, ...elements);
    safeInsertToArray(this._value, index, elements);

    for (let i = 0; i < elements.length; i++) {
      this.onAdd.emit(new EventAddArray(elements[i], index + i, this));
    }

    return this;
  }

  protected removeByIndex(index: number) {
    const removed = this._value.splice(index, 1);

    if (removed.length > 0) {
      this.onRemove.emit(new EventRemoveArray(removed[0], index, this));
    }

    return this;
  }

  constructor(
    sourceArray: zzReadonlyArray<T>,
    mapFn: (value: T, self: zzReadonlyArray<T>) => NewT
  ) {
    super([]);

    this.sourceArray = sourceArray;

    for (const element of sourceArray) {
      let newValue: NewT;

      const elementDestructor = zzDestructorsObserver.catch(() => {
        newValue = mapFn(element, sourceArray);
      });

      if (elementDestructor.size > 0) {
        this.destructorMap.set(element, elementDestructor);
      }

      this.add([newValue!]);
    }

    this._destructor.add(
      this.sourceArray.onAdd.addListener((ev) => {
        let newValue: NewT;

        const elementDestructor = zzDestructorsObserver.catch(() => {
          newValue = mapFn(ev.added, sourceArray);
        });

        if (elementDestructor.size > 0) {
          this.destructorMap.set(ev.added, elementDestructor);
        }

        this.add([newValue!], ev.index);
      }),
      this.sourceArray.onRemove.addListener((ev) => {
        this.destructorMap.get(ev.removed)?.destroy();

        this.removeByIndex(ev.index);
      }),
      this.sourceArray.onChange.addListener(() => {
        this.onChange.emit(
          new EventChangeValue(this._value, this._value, this)
        );
      })
    );
  }
}

export class zzComputeArrayFn<T> extends zzReadonlyArray<T> {
  protected _fn: () => T[];
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
          const newValue = this._fn.apply(this);

          zzGetReactiveObserver.runIsolated(() => {
            this.replace(newValue);
          });
        },
        () => this._isolate()
      )
    );
  }

  protected _silentReplace(newElements: T[]) {
    let currentIndex = 0;
    let deletedItems = 0;
    const array = this._value;
    this._value = newElements.slice();

    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index !== -1) {
        for (let k = currentIndex; k < index; k++) {
          this.onRemove.emit(
            new EventRemoveArray(array[k], currentIndex - deletedItems, this)
          );
        }

        deletedItems += index - currentIndex;
        currentIndex = index + 1;
      }
    }

    //remove all last elements
    for (let k = currentIndex; k < array.length; k++) {
      this.onRemove.emit(
        new EventRemoveArray(array[k], currentIndex - deletedItems, this)
      );
    }

    //add new elements
    currentIndex = 0;
    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index === -1) {
        this.onAdd.emit(new EventAddArray(newElements[i], i, this));
      } else {
        currentIndex = index + 1;
      }
    }
  }

  protected replace(newElements: T[]) {
    this._silentReplace(newElements);

    this.onChange.emit(new EventChangeValue(this._value, this._value, this));

    return this;
  }

  constructor(fn: () => T[]) {
    super([]);

    this._fn = fn;

    this._isolate();
  }
}

export function zzComputeArray<T>(fn: () => Array<T>) {
  return new zzComputeArrayFn(fn);
}

type ITreeArray<T> = T | zzReadonlyArray<ITreeArray<T>>;

export class zzArrayFlat<T> extends zzReadonlyArray<T> {
  protected readonly parentMap = new Map<
    zzReadonlyArray<ITreeArray<T>>,
    zzReadonlyArray<ITreeArray<T>>
  >();
  protected readonly destructorMap = new Map<ITreeArray<T>, IDestructor>();

  destroy(): void {
    super.destroy();
    this.destructorMap.forEach((destructor) => destructor.destroy());
    this.parentMap.clear();
  }

  protected add(elements: T[], index?: number) {
    index === undefined && (index = this._value.length);

    // this._value.splice(index, 0, ...elements);
    safeInsertToArray(this._value, index, elements);

    for (let i = 0; i < elements.length; i++) {
      this.onAdd.emit(new EventAddArray(elements[i], index + i, this));
    }

    return this;
  }

  protected remove(element: T) {
    const index = this._value.indexOf(element);
    if (index !== -1) {
      const removed = this._value.splice(index, 1);

      this.onRemove.emit(new EventRemoveArray(removed[0], index, this));
    }

    return index;
  }

  _unsubscribeRecursively(treeArray: ITreeArray<T>) {
    if (treeArray instanceof zzReadonlyArray) {
      this.parentMap.delete(treeArray);

      this.destructorMap.get(treeArray)?.destroy();
      this.destructorMap.delete(treeArray);

      for (const element of treeArray) {
        this._unsubscribeRecursively(element);
      }
    } else {
      this.remove(treeArray);
    }
  }

  _recursiverlyGetIndex(treeArray: ITreeArray<T>, endIndex: number): number {
    if (treeArray instanceof zzReadonlyArray) {
      let length = 0;

      let index = 0;
      for (const element of treeArray) {
        if (index === endIndex) {
          break;
        }

        length += this._recursiverlyGetIndex(element, Infinity);
        index++;
      }

      if (endIndex !== Infinity) {
        const parent = this.parentMap.get(treeArray);
        if (parent) {
          const childIndex = parent.toArray().indexOf(treeArray);

          length += this._recursiverlyGetIndex(parent, childIndex);
        }
      }

      return length;
    } else {
      return 1;
    }
  }

  _subscribeRecursively(
    treeArray: ITreeArray<T>,
    index: number,
    parent: zzReadonlyArray<ITreeArray<T>> | null = null
  ) {
    if (treeArray instanceof zzReadonlyArray) {
      this.destructorMap.set(
        treeArray,
        new DestructorsStack(
          treeArray.onAdd.addListener((ev) => {
            let realIndex = this._recursiverlyGetIndex(treeArray, ev.index);

            this._subscribeRecursively(ev.added, realIndex, treeArray);
          }),
          treeArray.onRemove.addListener((ev) => {
            this._unsubscribeRecursively(ev.removed);
          }),
          treeArray.onChange.addListener(() => {
            this.onChange.emit(
              new EventChangeValue(this._value, this._value, this)
            );
          })
        )
      );

      for (const element of treeArray) {
        index = this._subscribeRecursively(element, index);
      }

      if (parent !== null) {
        this.parentMap.set(treeArray, parent);
      }

      return index;
    } else {
      this.add([treeArray], index);

      return index + 1;
    }
  }

  constructor(sourceArray: ITreeArray<T>) {
    super([]);

    this._subscribeRecursively(sourceArray, 0);
  }
}
