import { zzObject } from "@lizzi/core";
import { zzHtmlNode } from "../../..";

export function useRef<T extends Element>(
  element: zzObject<T> | ((elem: T) => void)
) {
  return (view: zzHtmlNode<T>) => {
    if (element instanceof zzObject) {
      element.value = view.element;
    } else {
      element(view.element);
    }
  };
}
