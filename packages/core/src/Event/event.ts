/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzDestructor } from "../Destructor";

export interface IEventListener<TFunc extends (...args: any[]) => void> {
  run<T extends TFunc>(...args: Parameters<T>): Promise<any>;
  remove(): void;
  destroy(): void;
}

export interface IEvent<TFunc extends (...args: any[]) => void> {
  addListener(fn: TFunc): IEventListener<TFunc>;
  addListenerOnce(fn: TFunc): IEventListener<TFunc>;
  removeListener(fn: TFunc): void;
  removeAllListeners(): void;
  emit(...args: Parameters<TFunc>): void;
  countListeners(): number;
}

export type ExtractEventListener<T extends zzEvent<any>> = T extends zzEvent<
  infer Func
>
  ? Func
  : never;

export class zzEventListener<TFunc extends (...args: any[]) => void>
  extends zzDestructor
  implements IEventListener<TFunc>
{
  readonly target: zzEvent<TFunc>;
  readonly fn: TFunc;
  readonly willRunOnce: boolean;

  async run<FuncT extends TFunc>(...args: Parameters<FuncT>) {
    if (this.willRunOnce) {
      this.remove();
    }

    await this.fn.call(this.target, ...args);

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

  addListener<T extends TFunc>(fn: T): zzEventListener<T> {
    const newEventListener = new zzEventListener<T>(this, fn);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  addListenerOnce<T extends TFunc>(fn: T): zzEventListener<T> {
    const newEventListener = new zzEventListener<T>(this, fn, true);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  removeListener<T extends TFunc>(fn: T) {
    this.listenersMap.delete(fn);
  }

  removeAllListeners() {
    this.listenersMap.clear();
  }

  emit<T extends TFunc>(...args: Parameters<T>): Promise<any> {
    const values = Array.from(this.listenersMap.values());

    return Promise.all(values.map((listener) => listener.run(...args)));
  }

  countListeners(): number {
    return this.listenersMap.size;
  }
}
