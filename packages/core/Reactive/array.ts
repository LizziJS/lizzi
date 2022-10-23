/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  InferReactive,
  IReactive,
  IReactiveEvent,
  IReactiveValue,
  zzReactive,
} from "./reactive";
import { DestructorsStack, IDestructor } from "../Destructor";
import { zzEvent, EventsObserver, onStartListening } from "../Event";
import { ValueChangeEvent } from "./reactive";
import { zzMakeReactive, ValueOrReactive, runVar } from "./helpers";
import { zzCompute, zzComputeFn } from "./compute";

export class ArrayAddEvent<T> {
  constructor(
    public readonly added: T,
    public readonly index: number,
    public readonly target: zzArray<T>
  ) {}
}

export class ArrayRemoveEvent<T> {
  constructor(
    public readonly removed: T,
    public readonly index: number,
    public readonly target: zzArray<T>
  ) {}
}

export interface IArrayEvent<T> extends IReactiveEvent<T[]> {
  readonly onAdd: zzEvent<(event: ArrayAddEvent<T>) => void>;
  readonly onRemove: zzEvent<(event: ArrayRemoveEvent<T>) => void>;
}

export interface IArrayMethods<T> extends IReactiveValue<T[]> {
  readonly length: number;

  add(elements: T[], index?: number): this;
  addBefore(elements: T[], before: T): this;
  addAfter(elements: T[], after: T): this;

  remove(elements: T[]): this;
  removeByIndex(index: number): this;
  removeAll(): this;

  has(element: T): boolean;
  replace(newElements: T[]): this;

  toArray(): T[];
}

export type IArray<T> = IArrayEvent<T> & IArrayMethods<T>;

export class zzArray<T> extends zzReactive<T[]> implements IArray<T> {
  readonly onAdd = new zzEvent<(event: ArrayAddEvent<T>) => void>();
  readonly onRemove = new zzEvent<(event: ArrayRemoveEvent<T>) => void>();

  add(elements: T[], index?: number) {
    index === undefined && (index = this._value.length);

    this._value.splice(index, 0, ...elements);

    for (let i = 0; i < elements.length; i++) {
      this.onAdd.emit(new ArrayAddEvent(elements[i], index + i, this));
    }
    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

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
      this.onRemove.emit(new ArrayRemoveEvent(last[k], 0, this));
    }
    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

    return this;
  }

  remove(elements: T[]) {
    for (let d of elements) {
      let idx = this._value.indexOf(d);
      if (idx !== -1) {
        const removed = this._value.splice(idx, 1);
        this.onRemove.emit(new ArrayRemoveEvent(removed[0], idx, this));
      }
    }

    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

    return this;
  }

  removeByIndex(index: number) {
    if (typeof this._value[index] !== "undefined") {
      const removed = this._value.splice(index, 1);
      this.onRemove.emit(new ArrayRemoveEvent(removed[0], index, this));
      this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));
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
            new ArrayRemoveEvent(array[k], currentIndex - deletedItems, this)
          );
        }

        deletedItems += index - currentIndex;
        currentIndex = index + 1;
      }
    }

    //remove all last elements
    for (let k = currentIndex; k < array.length; k++) {
      this.onRemove.emit(
        new ArrayRemoveEvent(array[k], currentIndex - deletedItems, this)
      );
    }

    //add new elements
    currentIndex = 0;
    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index === -1) {
        this.onAdd.emit(new ArrayAddEvent(newElements[i], i, this));
      } else {
        currentIndex = index + 1;
      }
    }
  }

  replace(newElements: T[]) {
    this._silentReplace(newElements);

    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

    return this;
  }

  refresh() {
    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

    return this;
  }

  *[Symbol.iterator]() {
    for (let el of this.toArray()) {
      yield el;
    }
  }

  toArray() {
    return this._value;
  }

  get length() {
    return this.toArray().length;
  }

  get value() {
    return this.toArray();
  }

  set value(newElements: T[]) {
    this.replace(newElements);
  }

  /* helpers */
  setItemsListener(
    addFn: (item: T, array: this) => IDestructor | void,
    removeFn: (item: T, array: this) => void = () => {}
  ) {
    const destructionMap = new Map<T, IDestructor>();

    const addEvent = this.onAdd.addListener((ev) => {
      const toDestroy = addFn.call(this, ev.added, this);
      if (toDestroy) {
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
      addEvent.run(new ArrayAddEvent(element, index, this))
    );

    destructor.onDestroy.addListener(() => {
      this.toArray().forEach((element) =>
        removeEvent.run(new ArrayRemoveEvent(element, 0, this))
      );
    });

    return destructor;
  }

  filter(
    filterFn: (value: T, index: number, array: this) => boolean,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ) {
    return new zzComputeArrayFn(
      () =>
        this.toArray().filter((value, index) => filterFn(value, index, this)),
      this,
      ...dependencies
    );
  }

  includes(value: T | zzReactive<T>) {
    if (value instanceof zzReactive) {
      return zzCompute(() => this.toArray().includes(value.value), this, value);
    }

    return zzCompute(() => this.toArray().includes(value), this);
  }

  find(
    findFn: (value: T, index: number, array: this) => boolean,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ) {
    return zzCompute(
      () => this.toArray().find((value, index) => findFn(value, index, this)),
      this,
      ...dependencies
    );
  }

  sort(
    sortFn: (a: T, b: T) => number,
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ) {
    return new zzComputeArrayFn(
      () => this.toArray().slice().sort(sortFn),
      this,
      ...dependencies
    );
  }

  join(join: ValueOrReactive<string> = "") {
    const joinReact = zzMakeReactive(join);
    const refreshEvent = new zzEvent<() => void>();

    const joinedString = zzCompute(
      () => this.value.join(joinReact.value),
      this,
      joinReact,
      refreshEvent
    );

    onStartListening(
      () =>
        this.setItemsListener((item) => {
          if (item instanceof zzReactive) {
            return item.onChange.addListener(() => refreshEvent.emit());
          }
        }),
      joinedString.onChange
    );

    return joinedString;
  }

  map<NewT>(filterFn: (value: T, index: number, self: zzArray<T>) => NewT) {
    return new zzArrayMap<T, NewT>(this, filterFn);
  }

  constructor(array: T[] = []) {
    super(array.slice());
  }
}

export class zzComputeArrayFn<T> extends zzArray<T> {
  readonly sourceArray: zzComputeFn<Array<T>>;

  get value() {
    return this.toArray();
  }

  private set value(newElements: T[]) {
    throw new SyntaxError("You can not set compute array value");
  }

  toArray() {
    return this.sourceArray.value;
  }

  constructor(
    fn: (currentArray: Array<T>) => T[],
    ...dependencies: (zzReactive<any> | zzEvent<any>)[]
  ) {
    super([]);

    this.sourceArray = new zzComputeFn(
      () => (this._value = fn(this._value)),
      ...dependencies
    );

    onStartListening(
      () => {
        this._value = this.sourceArray.value;
        return this.sourceArray.onChange.addListener(() => {
          this.replace(this.sourceArray.value);
        });
      },
      this.onAdd,
      this.onChange,
      this.onRemove
    );
  }
}

export class zzArrayMap<T, NewT> extends zzArray<NewT> {
  readonly mappedArray: zzArray<T>;
  readonly sourceArray: zzArray<T>;
  readonly mapFn: (value: T, index: number, self: zzArray<T>) => NewT;
  protected readonly eventObserver: EventsObserver;

  protected _isSilent = false;

  add(elements: NewT[], index?: number) {
    index === undefined && (index = this._value.length);

    this._value.splice(index, 0, ...elements);

    if (this._isSilent) return this;

    for (let i = 0; i < elements.length; i++) {
      this.onAdd.emit(new ArrayAddEvent(elements[i], index + i, this));
    }
    this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));

    return this;
  }

  removeByIndex(index: number) {
    if (typeof this._value[index] !== "undefined") {
      const removed = this._value.splice(index, 1);

      if (this._isSilent) return this;

      this.onRemove.emit(new ArrayRemoveEvent(removed[0], index, this));
      this.onChange.emit(new ValueChangeEvent(this._value, this._value, this));
    }

    return this;
  }

  get value() {
    return this.toArray();
  }

  private set value(newElements: NewT[]) {
    throw new SyntaxError("You can not set mapped array value");
  }

  toArray() {
    if (!this.eventObserver.isWatching) {
      this.mappedArray.replace(this.sourceArray.toArray());
    }

    return this._value;
  }

  refreshElement(element: T) {
    let index = 0;
    const source = this.sourceArray.toArray();

    do {
      index = source.indexOf(element, index);
      if (index !== -1) {
        const newValue = this.mapFn(element, index, this.sourceArray);

        this.removeByIndex(index);
        this.add([newValue], index);
      }
    } while (index !== -1);

    return this;
  }

  refresh() {
    this.replace(
      this.mappedArray
        .toArray()
        .map((value, index) => this.mapFn(value, index, this.sourceArray))
    );

    return this;
  }

  constructor(
    sourceArray: zzArray<T>,
    mapFn: (value: T, index: number, self: zzArray<T>) => NewT
  ) {
    super([]);

    this.sourceArray = sourceArray;
    this.mappedArray = new zzArray<T>([]);
    this.mapFn = mapFn;

    this.mappedArray.onAdd.addListener((ev) => {
      const newValue = mapFn(ev.added, ev.index, this.sourceArray);

      this.add([newValue], ev.index);
    });

    this.mappedArray.onRemove.addListener((ev) => {
      this.removeByIndex(ev.index);
    });

    this.eventObserver = onStartListening(
      () => {
        //make silent values initialization, if listeners are added partly
        this._isSilent = true;
        this.mappedArray.replace(this.sourceArray.toArray());
        this._isSilent = false;

        return new DestructorsStack(
          sourceArray.onAdd.addListener((ev) => {
            this.mappedArray.add([ev.added], ev.index);
          }),
          sourceArray.onRemove.addListener((ev) => {
            this.mappedArray.removeByIndex(ev.index);
          })
        );
      },
      this.onAdd,
      this.onChange,
      this.onRemove
    );
  }
}

/**
 * experemental
 */
export class zzArrayModel<
  NewT extends zzReactive<any>,
  T = InferReactive<NewT>
> extends zzArray<T> {
  readonly model: zzArray<NewT>;

  get value(): T[] {
    return this.model.toArray().map((model) => model.value);
  }

  set value(array: T[]) {
    this.update(array);
  }

  update(array: T[]) {
    this.replace(array);
  }

  constructor(
    modelContructorFn: (value: T, index: number) => NewT,
    modelUpdateFn: (model: NewT, value: T) => void = (model, value) =>
      (model.value = value)
  ) {
    super([]);

    this.model = new zzComputeArrayFn(
      () =>
        this.toArray().map((value, index) => {
          const model = modelContructorFn(value, index);
          modelUpdateFn(model, value);
          return model;
        }),
      this
    );
  }
}
