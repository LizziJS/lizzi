/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

export * from "./view/ViewNode";
export * from "./use/attributes";
export * from "./HtmlVars";
export * from "./Tags";
export { ViewComponent } from "./view/ViewComponent";
export { TagAttributes, SvgView, HtmlView } from "./view/TagView";

import { ViewNode } from "./view/ViewNode";
import { TagAttributes, SvgView, HtmlView } from "./view/TagView";
import { views as body } from "./view/Body";
import { views as html } from "./HtmlView";
import { views as component } from "./view/ViewComponent";
import routes from "./Router/view";
import { views as ifview } from "./view/IfElseView";
import { views as title } from "./view/SetTitleView";

export const view = {
  ...body,
  ...component,
  ...html,
  ...routes,
  ...ifview,
  ...title,
  html: (
    tag: keyof HTMLElementTagNameMap,
    attributes: TagAttributes,
    childrens: ViewNode[] = []
  ) => new HtmlView(tag, attributes, childrens),
  svg: (
    tag: keyof SVGElementTagNameMap,
    attributes: TagAttributes,
    childrens: ViewNode[] = []
  ) => new SvgView(tag, attributes, childrens),
};
