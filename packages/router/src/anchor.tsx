import { zzNode } from "@lizzi/node";
import { JSX } from "@lizzi/template";
import { RouterComponent, UrlArray } from ".";

export type RouteAnchorName = string | Symbol;

export class RouteAnchor extends zzNode {
  readonly name: RouteAnchorName;

  isAnchorName(name: RouteAnchorName) {
    return name === this.name;
  }

  go(url: UrlArray = []) {
    const route = this.findParentNodes<RouterComponent>(
      (node) => node instanceof RouterComponent
    ).next().value;

    route?.go(url);
  }

  constructor({
    name,
    children = [],
  }: {
    name: RouteAnchorName;
    children?: JSX.NodeChildren;
  }) {
    super();

    this.name = name;

    this.append(children);
  }
}
