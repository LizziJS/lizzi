import { zzObject } from "@lizzi/core";
import { ViewElement } from "../elements";

export function useRef<T extends Element>(
  element: zzObject<T> | ((elem: T) => void)
) {
  return (view: ViewElement<T>) => {
    if (element instanceof zzObject) {
      element.value = view.element;
    } else {
      element(view.element);
    }
  };
}
