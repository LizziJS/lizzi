/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { JSX } from "@lizzi/jsx-runtime";
import { zzHtmlNode } from "../view/zzHtmlNode";

export const AppendToElement = (
  element: HTMLElement,
  children: JSX.Children
) => {
  return new zzHtmlNode(element, { children });
};

export const Body = (children: JSX.Children) => {
  return new zzHtmlNode(document.body, { children })._mount();
};
