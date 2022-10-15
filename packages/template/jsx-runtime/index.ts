export * from "./namespace";

import { isViewNodeConstructor, ViewClass, ViewNode } from "../view/ViewNode";
import { isSvgTag } from "../DOM/SvgTags";
import { HtmlView, SvgView } from "../DOM";
import { JSX } from "./namespace";

export const jsx = (
  type: string | ViewNode,
  props: {
    [k: string]: any;
    children: any;
  }
): ViewNode => {
  return jsxs(type, props);
};

export const jsxs = (
  type: string | ViewNode,
  props: {
    svg?: boolean | undefined;
    children: JSX.Childrens;
    [k: string]: any;
  }
): ViewNode => {
  if (typeof type === "string") {
    if (isSvgTag.has(type as any) || props.svg) {
      return new SvgView(type as any, props);
    }

    return new HtmlView(type as any, props);
  } else if (typeof type === "function") {
    if (type[isViewNodeConstructor]) {
      return new (type as new (props: object) => ViewNode)(props);
    }

    return (type as (props: object) => ViewNode)(props);
  } else {
    throw new Error(
      "JSX constructor should be string, HTML tag or ViewNode constructor"
    );
  }
};
