/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzDestructor } from "../Destructor";

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

type EventParameters<TM, Type extends keyof TM> = Parameters<
  (
    type: Type,
    listener: (ev: TM[Type]) => void,
    options?: boolean | AddEventListenerOptions
  ) => void
>;

type WindowEventFunctionParams<Type extends keyof WindowEventMap> =
  EventParameters<WindowEventMap, Type>;

type HTMLElementEventFunctionParams<Type extends keyof HTMLElementEventMap> =
  EventParameters<HTMLElementEventMap, Type>;

type DocumentEventFunctionParams<Type extends keyof DocumentEventMap> =
  EventParameters<DocumentEventMap, Type>;

export type EventWrapperObject =
  | Window
  | HTMLElement
  | Document
  | EventEmitterType1
  | EventEmitterType2
  | EventEmitterType3;

export type EventWrapperParam<TObj extends EventWrapperObject> =
  TObj extends Window
    ? WindowEventFunctionParams<keyof WindowEventMap>
    : TObj extends HTMLElement
    ? HTMLElementEventFunctionParams<keyof HTMLElementEventMap>
    : TObj extends Document
    ? DocumentEventFunctionParams<keyof HTMLElementEventMap>
    : TObj extends EventEmitterType1
    ? Parameters<TObj["on"]>
    : TObj extends EventEmitterType2
    ? Parameters<TObj["addEventListener"]>
    : TObj extends EventEmitterType3
    ? Parameters<TObj["addListener"]>
    : never;

export class EventWrapper<T extends EventWrapperObject> extends zzDestructor {
  readonly object: T;
  readonly params: EventWrapperParam<T>;

  run(...args: Parameters<EventWrapperParam<T>[1]>) {
    this.params[1](...args);

    return this;
  }

  remove() {
    this.destroy();
  }

  destroy() {
    let off =
      (this.object as EventEmitterType1).off ||
      (this.object as EventEmitterType2).removeEventListener ||
      (this.object as EventEmitterType3).removeListener;

    off && off.call(this.object, ...this.params);

    return this;
  }

  constructor(object: T, ...params: EventWrapperParam<T>) {
    super();

    this.object = object;
    this.params = params;

    let on =
      (object as EventEmitterType1).on ||
      (object as EventEmitterType2).addEventListener ||
      (object as EventEmitterType3).addListener;

    on && on.call(object, ...params);
  }
}

// export addListener function shortcut for EventWrapper
export function addListener<T extends EventWrapperObject>(
  object: T,
  ...params: EventWrapperParam<T>
): EventWrapper<T> {
  return new EventWrapper(object, ...params);
}
