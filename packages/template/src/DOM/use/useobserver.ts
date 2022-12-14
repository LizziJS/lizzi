import { createEffect } from "@lizzi/core";
import { ViewElement } from "..";

export function useEffect<T extends ViewElement>(fn: (view: T) => void) {
  return (view: T) => {
    view.addToUnmount(createEffect(() => fn(view)));
  };
}
