/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewElement } from "../DOM";
import { ViewNode } from "../view/ViewNode";

export const AppendToElement = (element: HTMLElement, children: ViewNode) => {
  return new ViewElement(element).append([children]);
};

export const Body = (children: ViewNode) => {
  return new ViewElement(document.body).append([children]).mount();
};
