/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { JSX } from "@lizzi/jsx-runtime";
import { ViewNode } from "./ViewNode";

export class ViewComponent extends ViewNode {
  readonly element: Node;

  constructor({ children }: { children?: JSX.Childrens } = {}) {
    super();

    this.element = document.createTextNode("");
    this.setNodes([this.element]);

    this.append(children);
  }
}
