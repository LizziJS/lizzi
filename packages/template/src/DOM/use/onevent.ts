import { EventWrapper } from "@lizzi/core";
import { ViewElement } from "..";

export function on<T extends ViewElement>(
  eventName: Parameters<T["element"]["addEventListener"]>[0],
  fn: <E extends Event>(event: E, view: T) => void,
  options: boolean = false
) {
  return (view: T) => {
    view.addToUnmount(
      new EventWrapper(view.element, eventName, (ev) => fn(ev, view), options)
    );
  };
}

export const onEvent = on;
