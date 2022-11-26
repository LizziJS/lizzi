/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { DomElementView } from "../DOM";
import { ViewNode } from "../view/ViewNode";

export const AppendToElement = (element: HTMLElement, children: ViewNode) => {
  return new DomElementView(element).append([children]);
};

export const Body = (children: ViewNode) => {
  return new DomElementView(document.body).append([children]).mount();
};
