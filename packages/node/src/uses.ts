import { zzObject } from "@lizzi/core";
import { zzNode } from "./node";

export const ref =
  <T extends zzNode>(ref: zzObject<T>) =>
  (node: T) => {
    ref.value = node;
    node.onceUnmount(() => (ref.value = null));
  };
