import { EventWrapper } from "@lizzi/core";
import { DomElementView } from "..";

export function on<T extends DomElementView>(
  eventName: Parameters<T["element"]["addEventListener"]>[0],
  fn: (...args: any) => any,
  options: boolean = false
) {
  return (view: T) => {
    view.addToUnmount(new EventWrapper(view.element, eventName, fn, options));
  };
}

export const onEvent = on;
