import { zzNode } from "@lizzi/node";
import { RouteAnchorName, Router, UrlArray } from ".";

export const zzRouter = (currentNode: zzNode) => ({
  goBack: () => {
    currentNode
      .findParentNodes<Router>((node) => node instanceof Router)
      .next()
      .value?.url.goBack();
  },
  go: (url: UrlArray) => {
    currentNode
      .findParentNodes<Router>((node) => node instanceof Router)
      .next()
      .value?.url.go(url);
  },
  goAnchor: (name: RouteAnchorName, url: UrlArray = []) => {
    const anchor = currentNode
      .findParentNodes<Router>((node) => node instanceof Router)
      .next()
      .value?.findAnchor(name);

    if (!anchor) console.error(`Anchor '${name}' not found`);

    anchor?.go(url);
  },
});
