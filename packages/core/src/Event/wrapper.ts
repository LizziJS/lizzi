/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IDestructor } from "../Destructor";

type EventEmitterType1 = {
  on(...args: any[]): any;
  off(...args: any[]): any;
};

type EventEmitterType2 = {
  addEventListener(...args: any[]): any;
  removeEventListener(...args: any[]): any;
};

type EventEmitterType3 = {
  addListener(...args: any[]): any;
  removeListener(...args: any[]): any;
};

export class EventWrapper<
  T1 extends EventEmitterType1,
  T2 extends EventEmitterType2,
  T3 extends EventEmitterType3
> implements IDestructor
{
  readonly object: any;
  readonly params: any[];

  run(...args: Parameters<Parameters<T1["on"]>[1]>): EventWrapper<T1, T2, T3>;
  run(
    ...args: Parameters<Parameters<T2["addEventListener"]>[1]>
  ): EventWrapper<T1, T2, T3>;
  run(
    ...args: Parameters<Parameters<T3["removeListener"]>[1]>
  ): EventWrapper<T1, T2, T3> {
    this.params[1](...args);

    return this;
  }

  remove() {
    this.destroy();
  }

  destroy() {
    let off =
      this.object.off ||
      this.object.removeEventListener ||
      this.object.removeListener;

    off && off.call(this.object, ...this.params);

    return this;
  }

  constructor(object: T1, ...params: Parameters<T1["on"]>);
  constructor(object: T2, ...params: Parameters<T2["addEventListener"]>);
  constructor(object: T3, ...params: Parameters<T3["addListener"]>);
  constructor(object: any, ...params: any[]) {
    this.object = object;
    this.params = params;

    let on = object.on || object.addEventListener || object.addListener;

    on && on.call(object, ...params);
  }
}
