import { EventWrapper } from "@lizzi/core/Event";
import { DomElementView } from "../view/TagView";

export function onEvent<T extends DomElementView>(
  eventName: Parameters<T["element"]["addEventListener"]>[0],
  fn: (...args: any) => any,
  options: boolean = false
) {
  return (view: T) => {
    view.addToUnmount(new EventWrapper(view.element, eventName, fn, options));
  };
}
