import { EventWrapper } from "@lizzi/core";
import { zzHtmlNode } from "../../..";

export function on<T extends zzHtmlNode>(
  eventName: Parameters<T["element"]["addEventListener"]>[0],
  fn: (event: any, view: T) => void,
  options: boolean = false
) {
  return (view: T) => {
    new EventWrapper(
      view.element,
      eventName,
      (ev: any) => fn(ev, view),
      options
    );
  };
}
