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

  constructor() {
    zzDestructorsObserver.add(this);
  }
}

export class DestructorsStack extends zzDestructor {
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
  }

  constructor(...destructors: IDestructor[]) {
    super();

    this.addArray(destructors);
  }
}

export function DestructorFn(destroy: () => void): IDestructor {
  return { destroy };
}
