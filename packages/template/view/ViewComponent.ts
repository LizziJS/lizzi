/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewNode } from "./ViewNode";

export class ViewComponent extends ViewNode {
  readonly element: Node;

  constructor(childrens: ViewNode[] = []) {
    super();

    this.element = document.createTextNode("");
    this.setNodeElements([this.element]);

    this.append(childrens);
  }
}

export const views = {
  Component: (childrens: ViewNode[]) => new ViewComponent(childrens),
};
