/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue } from "./reactive";
import { DestructorsStack, zzDestructorsObserver } from "../Destructor";
import { zzType } from "./type";

export class zzObject<T> extends zzType<T | null> {
  itemListener(
    setFn: (item: T) => void,
    unsetFn: (item: T) => void = () => {}
  ) {
    const destructor = new DestructorsStack();

    this.onChange
      .addListener((ev) => {
        destructor.destroy();

        if (ev.last !== null) {
          unsetFn(ev.last);
        }

        if (ev.value !== null) {
          destructor.add(zzDestructorsObserver.catch(() => setFn(ev.value!)));
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
