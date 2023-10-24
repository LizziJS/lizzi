import { DestructorsStack } from "../../Destructor";
import { ReactiveEventChange, zzReactiveValueGetObserver } from "../reactive";
import {
  ReactiveArrayEventAdd,
  ReactiveArrayEventRemove,
  zzReadonlyArray,
} from "./readonlyArray";

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
      zzReactiveValueGetObserver.catch(
        () => {
          const newValue = this._fn.apply(this);

          zzReactiveValueGetObserver.runIsolated(() => {
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

  protected replace(newElements: T[]) {
    this._silentReplace(newElements);

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

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
