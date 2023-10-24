import { DestructorsStack, IDestructor } from "../../Destructor";
import { ReactiveEventChange } from "../reactive";
import {
  ReactiveArrayEventAdd,
  ReactiveArrayEventRemove,
  zzReadonlyArray,
} from "./readonlyArray";

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

  protected addElement(element: T, index?: number) {
    index === undefined && (index = this._value.length);

    this._value.splice(index, 0, element);

    this.onAdd.emit(new ReactiveArrayEventAdd(element, index, this));

    this.onChange.emit(new ReactiveEventChange(this._value, this._value, this));

    return this;
  }

  protected removeElement(element: T) {
    const index = this._value.indexOf(element);
    if (index !== -1) {
      const removed = this._value.splice(index, 1);

      this.onRemove.emit(new ReactiveArrayEventRemove(removed[0], index, this));

      this.onChange.emit(
        new ReactiveEventChange(this._value, this._value, this)
      );
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
      this.removeElement(treeArray);
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
          })
        )
      );

      for (const element of treeArray) {
        index = this._subscribeRecursively(element, index, treeArray);
      }

      if (parent !== null) {
        this.parentMap.set(treeArray, parent);
      }

      return index;
    } else {
      this.addElement(treeArray, index);

      return index + 1;
    }
  }

  constructor(sourceArray: zzReadonlyArray<T>) {
    super([]);

    this._subscribeRecursively(sourceArray as any, 0);
  }
}
