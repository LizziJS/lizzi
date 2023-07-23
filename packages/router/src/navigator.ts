import { zzNode } from "@lizzi/node";
import { Router } from ".";

export const zzRouter = (currentNode: zzNode) => ({
  goBack: () => {
    currentNode
      .findParentNodes<Router>((node) => node instanceof Router)
      .next()
      .value?.url.goBack();
  },
  go: (url: Array<string>) => {
    currentNode
      .findParentNodes<Router>((node) => node instanceof Router)
      .next()
      .value?.url.go(url);
  },
});
