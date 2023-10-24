import {
  DestructorsStack,
  IDestructor,
  zzDestructorsObserver,
} from "../../Destructor";
import { ReactiveEventChange } from "../reactive";
import {
  ReactiveArrayEventAdd,
  ReactiveArrayEventRemove,
  zzReadonlyArray,
} from "./readonlyArray";
import { safeInsertToArray } from "./tools";

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
      this.onAdd.emit(new ReactiveArrayEventAdd(elements[i], index + i, this));
    }

    return this;
  }

  protected removeByIndex(index: number) {
    const removed = this._value.splice(index, 1);

    if (removed.length > 0) {
      this.onRemove.emit(new ReactiveArrayEventRemove(removed[0], index, this));
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
          new ReactiveEventChange(this._value, this._value, this)
        );
      })
    );
  }
}
