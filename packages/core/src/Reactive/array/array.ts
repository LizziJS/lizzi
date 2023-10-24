import { IWriteOnlyReactive, ReactiveEventChange } from "../reactive";
import {
  IReadOnlyArray,
  ReactiveArrayEventAdd,
  ReactiveArrayEventRemove,
  zzReadonlyArray,
} from "./readonlyArray";
import { safeInsertToArray } from "./tools";

export interface IWriteOnlyArray<T> extends IWriteOnlyReactive<T[]> {
  add(elements: T[], index?: number): this;
  addBefore(elements: T[], before: T): this;
  addAfter(elements: T[], after: T): this;

  remove(elements: T[]): this;
  removeByIndex(index: number): this;
  removeAll(): this;

  replace(newElements: T[]): this;
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
      this.onAdd.emit(new ReactiveArrayEventAdd(elements[i], index + i, this));
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

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
      this.onRemove.emit(new ReactiveArrayEventRemove(last[k], 0, this));
    }
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  remove(elements: T[]) {
    for (let d of elements) {
      let idx = this._value.indexOf(d);
      if (idx !== -1) {
        const removed = this._value.splice(idx, 1);
        this.onRemove.emit(new ReactiveArrayEventRemove(removed[0], idx, this));
      }
    }

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  removeByIndex(index: number) {
    const removed = this._value.splice(index, 1);

    if (removed.length > 0) {
      this.onRemove.emit(new ReactiveArrayEventRemove(removed[0], index, this));
      this.onChange.emit(
        new ReactiveEventChange(this._value, this._value, this)
      );
    }

    return this;
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
            new ReactiveArrayEventRemove(
              array[k],
              currentIndex - deletedItems,
              this
            )
          );
        }

        deletedItems += index - currentIndex;
        currentIndex = index + 1;
      }
    }

    //remove all last elements
    for (let k = currentIndex; k < array.length; k++) {
      this.onRemove.emit(
        new ReactiveArrayEventRemove(
          array[k],
          currentIndex - deletedItems,
          this
        )
      );
    }

    //add new elements
    currentIndex = 0;
    for (let i = 0; i < newElements.length; i++) {
      //follow new array and find it in old array
      const index = array.indexOf(newElements[i], currentIndex);
      if (index === -1) {
        this.onAdd.emit(new ReactiveArrayEventAdd(newElements[i], i, this));
      } else {
        currentIndex = index + 1;
      }
    }
  }

  replace(newElements: T[]) {
    this._silentReplace(newElements);

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  refresh() {
    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  get value() {
    return this.toArray();
  }

  set value(newElements: T[]) {
    this.replace(newElements);
  }

  readonly() {
    return this as IReadOnlyArray<T>;
  }
}
