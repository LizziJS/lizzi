/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzDestructorsObserver } from "./observer";

export interface IDestructor {
  destroy(): void;
}

export abstract class zzDestructor implements IDestructor {
  abstract destroy(): void;

  constructor(silent: boolean = false) {
    if (!silent) {
      zzDestructorsObserver.add(this);
    }
  }
}

export class SilentDestructorsStack extends zzDestructor {
  readonly destructors = new Set<IDestructor>();

  get size() {
    return this.destructors.size;
  }

  destroy() {
    for (const destructor of this.destructors) {
      destructor.destroy();
    }

    this.destructors.clear();

    return this;
  }

  add(...destructors: IDestructor[]) {
    return this.addArray(destructors);
  }

  addArray(destructors: IDestructor[]) {
    for (const destructor of destructors) {
      this.destructors.add(destructor);
    }

    return this;
  }

  addFunc(...fn: (() => void)[]) {
    this.add(...fn.map(DestructorFn));

    return this;
  }
}

export class DestructorsStack extends SilentDestructorsStack {
  constructor(...destructors: IDestructor[]) {
    super(false);

    this.addArray(destructors);
  }
}

export function DestructorFn(destroy: () => void): IDestructor {
  return { destroy };
}
