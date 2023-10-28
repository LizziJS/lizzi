import { ReactiveEventChange, zzReadonly } from "@lizzi/core";
import { zzNode } from "./node";

export class ObjectView<T extends zzNode> extends zzNode {
  constructor({ children }: { children: zzReadonly<T | null> }) {
    super();

    this.onMount(() => {
      children.onChange
        .addListener((ev) => {
          if (ev.value === null) {
            this.childNodes.removeAll();
          } else if (zzNode.isNode(ev.value)) {
            this.childNodes.removeAll();
            this.childNodes.add([ev.value]);
          } else {
            this.childNodes.removeAll();
          }
        })
        .run(ReactiveEventChange.new(children));
    });
  }
}
