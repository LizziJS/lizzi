/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewNode } from "./ViewNode";

export class ViewComponent extends ViewNode {
  readonly element: Node;

  constructor({ children }: { children?: ViewNode[] }) {
    super();

    this.element = document.createTextNode("");
    this.setNodeElements([this.element]);

    this.append(children ?? []);
  }
}
