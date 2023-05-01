/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue } from "./reactive";
import {
  DestructorsStack,
  IDestructor,
  zzDestructorsObserver,
} from "../Destructor";
import { zzType } from "./type";

export class zzObject<T> extends zzType<T | null> {
  itemListener(changeFn: (item: T) => IDestructor) {
    const destructor = new DestructorsStack();

    this.onChange
      .addListener((ev) => {
        destructor.destroy();

        if (ev.value !== null) {
          destructor.add(
            zzDestructorsObserver.catch(() => changeFn(ev.value!))
          );
        }
      })
      .run(new EventChangeValue(this.value, null, this));

    return this;
  }

  constructor(value: T | null = null) {
    super(value);

    this.addValidator((value) => typeof value === "object");
  }
}
