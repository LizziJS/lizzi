/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewNode } from "./ViewNode";

export class Element extends ViewNode {
  readonly element: HTMLElement;

  protected _appendElement(view: ViewNode, beforeViewNode: ViewNode | null) {
    const nodes = view.getElements();
    const before = beforeViewNode ? beforeViewNode.getFirstElement() : null;
    for (let node of nodes) {
      this.element.insertBefore(node, before);
    }
  }

  constructor(element: HTMLElement, childrens: ViewNode[] = []) {
    super();

    this.element = element;
    this.setNodeElements([element]);

    this.append(childrens);

    this.mount();
  }
}

export class Body extends Element {
  constructor(childrens: ViewNode[] = []) {
    super(document.body, childrens);
  }
}

export default {
  Body: (childrens: ViewNode[]) => new Body(childrens),
  AppendToElement: (element: HTMLElement, childrens: ViewNode[]) =>
    new Element(element, childrens),
};
