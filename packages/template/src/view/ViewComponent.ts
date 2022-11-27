/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { JSX } from "@lizzi/jsx-runtime";
import { ViewNode } from "./ViewNode";

export type NodeProp<T extends ViewNode = ViewNode> = JSX.Children<T>;

export type NodesProp<T extends ViewNode = ViewNode> = JSX.Childrens<T>;

export type PropsWithChildrens<
  P extends object = {},
  T extends ViewNode = ViewNode
> = P & {
  children: NodesProp<T>;
};

export class ViewComponent extends ViewNode {
  readonly element: Node;

  constructor({ children }: { children?: NodesProp<any> } = {}) {
    super();

    this.element = document.createTextNode("");
    this.setNodes([this.element]);

    this.append(children);
  }
}
