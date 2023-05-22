/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "../Reactive";
import { zzEvent } from "./event";

export function Debounce(fn: () => void, time = 0): () => void {
  let timer = true;

  let timeoutFnCall = () => {
    timer = true;

    fn.call(null);
  };

  return function () {
    if (timer) {
      timer = false;
      setTimeout(timeoutFnCall, time);
    }
  };
}

export function zzGroupEvent(...events: (zzEvent<any> | zzReactive<any>)[]) {
  const newEvent = new zzEvent<() => void>();

  for (const event of events) {
    if (zzEvent.isEvent(event)) {
      event.addListener(() => newEvent.emit());
    } else if (zzReactive.isReactive(event)) {
      (event as zzReactive<any>).onChange.addListener(() => newEvent.emit());
    }
  }

  return newEvent;
}
