import { EventWrapperObject, EventWrapperParam, addListener } from "../Event";
import { zzReactive } from "./reactive";

export function zzFromEvent<R, T extends EventWrapperObject>(
  initialValue: R,
  object: T,
  eventName: EventWrapperParam<T>[0],
  fn: (...args: Parameters<EventWrapperParam<T>[1]>) => R,
  ...params: any
) {
  const reactive = new zzReactive<R>(initialValue);

  addListener<any>(
    object,
    eventName,
    (...args: any) => {
      reactive.value = fn(...args);
    },
    ...params
  );

  return reactive;
}
