/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzDestructor } from "../Destructor";

export interface IEvent<TFunc extends (...args: any[]) => void> {
  addListener(fn: TFunc): zzEventListener<TFunc>;
  addListenerOnce(fn: TFunc): zzEventListener<TFunc>;
  removeListener(fn: TFunc): void;
  removeAllListeners(): void;
  emit(...args: Parameters<TFunc>): void;
  countListeners(): number;
}

export class zzEventListener<
  TFunc extends (...args: any[]) => void
> extends zzDestructor {
  readonly target: zzEvent<TFunc>;
  readonly fn: TFunc;
  readonly willRunOnce: boolean;

  run<FuncT extends TFunc>(...args: Parameters<FuncT>) {
    if (this.willRunOnce) {
      this.remove();
    }

    this.fn.call(this.target, ...args);

    return this;
  }

  remove() {
    this.destroy();
  }

  destroy() {
    this.target.removeListener(this.fn);

    return this;
  }

  constructor(target: zzEvent<any>, fn: TFunc, runOnce: boolean = false) {
    super();

    this.target = target;
    this.fn = fn;
    this.willRunOnce = runOnce;
  }
}

export class zzEvent<TFunc extends (...args: any[]) => void>
  extends zzDestructor
  implements IEvent<TFunc>
{
  protected readonly listenersMap = new Map<TFunc, zzEventListener<TFunc>>();

  static isEvent(check: any): check is zzEvent<any> {
    return (
      check &&
      typeof check["addListener"] === "function" &&
      typeof check["emit"] === "function"
    );
  }

  destroy(): void {
    this.removeAllListeners();
  }

  addListener<FuncT extends TFunc>(fn: FuncT): zzEventListener<FuncT> {
    const newEventListener = new zzEventListener<FuncT>(this, fn);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  addListenerOnce<FuncT extends TFunc>(fn: FuncT): zzEventListener<FuncT> {
    const newEventListener = new zzEventListener<FuncT>(this, fn, true);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  removeListener<FuncT extends TFunc>(fn: FuncT) {
    this.listenersMap.delete(fn);
  }

  removeAllListeners() {
    this.listenersMap.clear();
  }

  emit<FuncT extends TFunc>(...args: Parameters<FuncT>) {
    const values = Array.from(this.listenersMap.values());

    for (let listener of values) {
      listener.run(...args);
    }
  }

  countListeners(): number {
    return this.listenersMap.size;
  }
}
