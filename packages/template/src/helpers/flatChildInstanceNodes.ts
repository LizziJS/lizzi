import { zzReadonlyArray } from "@lizzi/core";
import { zzNode } from "@lizzi/node";

export function flatChildInstanceNodes<T extends zzNode>(
  childNodes: zzReadonlyArray<zzNode>,
  instance: new (...any: any) => T
) {
  type MapT = T | zzReadonlyArray<MapT>;

  const mapNodes = (node: zzNode): MapT => {
    if (node instanceof instance) {
      return node;
    }

    return node.childNodes.map(mapNodes);
  };

  return childNodes.map(mapNodes).flat();
}
