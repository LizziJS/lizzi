/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { DestructorsStack } from "../Destructor";
import { onStartListening, zzEvent } from "../Event";
import { InferReactive, zzReactive } from "./reactive";

export type InferModel<Type extends object> = {
  [P in keyof Type]: InferReactive<Type[P]>;
};

export class ModelUpdateEvent<T extends object> {
  readonly values: Partial<InferModel<T>>;
  readonly target: zzModel<T>;

  constructor(values: Partial<InferModel<T>>, target: zzModel<T>) {
    this.values = values;
    this.target = target;
  }
}

export class zzModel<T extends object> extends zzReactive<InferModel<T>> {
  readonly model: T;
  readonly onUpdate = new zzEvent<(values: any) => void>();

  values(): InferModel<T> {
    let result: any = {};

    for (let name in this.model) {
      const value = this.model[name];
      if (value instanceof zzReactive) {
        result[name] = value.value;
      } else {
        result[name] = value;
      }
    }

    return result;
  }

  get value(): InferModel<T> {
    return this.values();
  }

  update(values: Partial<InferModel<T>>) {
    const updates: Partial<InferModel<T>> = {};

    for (let name in this.model) {
      const value = values[name];
      if (value === undefined) {
        continue;
      }

      const rvalue = this.model[name];
      if (rvalue instanceof zzReactive) {
        updates[name] = value;
        try {
          rvalue.value = value;
        } catch (err) {
          if (err instanceof TypeError) {
            throw new TypeError("in " + name + " " + err.message);
          } else {
            throw err;
          }
        }
      }
    }

    this.onUpdate.emit(new ModelUpdateEvent(updates, this));

    return this;
  }

  set value(values: any) {
    this.update(values);
  }

  sync() {
    onStartListening(() => {
      const destructor = new DestructorsStack();

      for (let name in this.model) {
        const value = this.model[name];

        if (value instanceof zzReactive) {
          destructor.add(
            value.onChange.addListener((ev) => {
              this.onChange.emit(ev);
            })
          );
        }
      }

      return destructor;
    }, this.onChange);

    return this;
  }

  concat<B extends object>(modelB: zzModel<B>) {
    return new zzModelConcat<T, B>(this, modelB);
  }

  constructor(model: T) {
    super({} as any);

    this.model = model;
  }
}

export class zzModelSync<T extends object> extends zzModel<T> {
  constructor(model: T) {
    super(model);

    this.sync();
  }
}

export class zzModelConcat<A extends object, B extends object> extends zzModel<
  A & B
> {
  constructor(modelA: zzModel<A>, modelB: zzModel<B>) {
    super(Object.assign({}, modelA.model, modelB.model) as any);

    onStartListening(
      () =>
        new DestructorsStack(
          modelA.onChange.addListener((ev) => {
            this.onChange.emit(ev as any);
          }),
          modelB.onChange.addListener((ev) => {
            this.onChange.emit(ev as any);
          })
        ),
      this.onChange
    );
  }
}
