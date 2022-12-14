import { IDestructor } from "@lizzi/core";
import { ViewElement } from "..";

export function addToUnmount<T extends ViewElement>(
  fn: (view: T) => IDestructor
) {
  return (view: T) => {
    view.addToUnmount(fn(view));
  };
}
