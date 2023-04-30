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

type EventKeys<TObj> = TObj extends EventEmitterType1
  ? Parameters<TObj["on"]>
  : TObj extends EventEmitterType2
  ? Parameters<TObj["addEventListener"]>
  : TObj extends EventEmitterType3
  ? Parameters<TObj["addListener"]>
  : never;

export class EventWrapper<
  TW extends Window,
  TE extends HTMLElement,
  TD extends Document,
  T extends EventEmitterType1 | EventEmitterType2 | EventEmitterType3,
  WType extends keyof WindowEventMap,
  EType extends keyof HTMLElementEventMap,
  DType extends keyof HTMLElementEventMap
> extends zzDestructor {
  readonly object: any;
  readonly params: any[];

  run(...args: Parameters<EventKeys<T>[1]>) {
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

  constructor(object: TW, ...params: WindowEventFunctionParams<WType>);
  constructor(object: TE, ...params: HTMLElementEventFunctionParams<EType>);
  constructor(object: TD, ...params: DocumentEventFunctionParams<DType>);
  constructor(object: T, ...params: EventKeys<T>);
  constructor(object: any, ...params: any[]) {
    super();

    this.object = object;
    this.params = params;

    let on = object.on || object.addEventListener || object.addListener;

    on && on.call(object, ...params);
  }
}

// export addListener function shortcut for EventWrapper
export function addListener<
  TW extends Window,
  TE extends HTMLElement,
  TD extends Document,
  T extends EventEmitterType1 | EventEmitterType2 | EventEmitterType3,
  WType extends keyof WindowEventMap,
  EType extends keyof HTMLElementEventMap,
  DType extends keyof HTMLElementEventMap
>(
  object: TW,
  ...params: WindowEventFunctionParams<WType>
): EventWrapper<TW, TE, TD, T, WType, EType, DType>;
export function addListener<
  TW extends Window,
  TE extends HTMLElement,
  TD extends Document,
  T extends EventEmitterType1 | EventEmitterType2 | EventEmitterType3,
  WType extends keyof WindowEventMap,
  EType extends keyof HTMLElementEventMap,
  DType extends keyof HTMLElementEventMap
>(
  object: TE,
  ...params: HTMLElementEventFunctionParams<EType>
): EventWrapper<TW, TE, TD, T, WType, EType, DType>;
export function addListener<
  TW extends Window,
  TE extends HTMLElement,
  TD extends Document,
  T extends EventEmitterType1 | EventEmitterType2 | EventEmitterType3,
  WType extends keyof WindowEventMap,
  EType extends keyof HTMLElementEventMap,
  DType extends keyof HTMLElementEventMap
>(
  object: TD,
  ...params: DocumentEventFunctionParams<DType>
): EventWrapper<TW, TE, TD, T, WType, EType, DType>;
export function addListener<
  TW extends Window,
  TE extends HTMLElement,
  TD extends Document,
  T extends EventEmitterType1 | EventEmitterType2 | EventEmitterType3,
  WType extends keyof WindowEventMap,
  EType extends keyof HTMLElementEventMap,
  DType extends keyof HTMLElementEventMap
>(
  object: T,
  ...params: EventKeys<T>
): EventWrapper<TW, TE, TD, T, WType, EType, DType>;
export function addListener(object: any, ...params: any[]) {
  return new EventWrapper(object, ...params);
}
