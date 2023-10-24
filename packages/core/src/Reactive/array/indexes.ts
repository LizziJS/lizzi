import {
  DestructorsStack,
  zzDestructor,
  zzDestructorsObserver,
} from "../../Destructor";
import { zzReactive } from "../reactive";
import { IReadOnlyArray } from "./readonlyArray";

export class zzArrayIndex<T> extends zzDestructor {
  protected readonly _destructor = new DestructorsStack();
  protected readonly indexMap = new Map<T, zzReactive<number>>();

  getIndex(item: T) {
    return this.indexMap.get(item)!.readonly();
  }

  destroy(): void {
    this._destructor.destroy();

    this.indexMap.forEach((idx) => idx.destroy());

    this.indexMap.clear();
  }

  constructor(array: IReadOnlyArray<T>) {
    super();

    this._destructor.addArray(
      zzDestructorsObserver.runIsolated(() => {
        array.itemsListener(
          (item, index) => {
            for (const idx of this.indexMap.values()) {
              if (idx.value >= index) idx.value++;
            }

            this.indexMap.set(item, new zzReactive(index));
          },
          (item, index) => {
            this.indexMap.delete(item);

            for (const idx of this.indexMap.values()) {
              if (idx.value >= index) idx.value--;
            }
          }
        );
      })
    );
  }
}
