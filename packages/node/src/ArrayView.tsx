import { zzReadonlyArray } from "@lizzi/core";
import { zzNode } from "./node";
import { NodeDebug } from "./debug";

export class ArrayView<T extends zzNode> extends zzNode {
  constructor({ children }: { children: zzReadonlyArray<T> | T[] }) {
    super();

    if (zzReadonlyArray.isArray(children)) {
      this.onMount(() => {
        children
          .filter((view) => view instanceof zzNode)
          .itemsListener(
            (added, index) => {
              this.childNodes.add([added], index);
            },
            (removed) => {
              NodeDebug.log(`ArrayView removed ${removed.debugName}`);
              this.childNodes.remove([removed]);
            }
          );
      });
    } else if (Array.isArray(children)) {
      this.childNodes.add(
        children.filter((view) => view instanceof zzNode) as T[]
      );
    } else {
      throw new Error("children must be zzNode[] or zzArray<zzNode>");
    }
  }
}
