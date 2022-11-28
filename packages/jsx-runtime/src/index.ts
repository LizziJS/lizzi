export * from "./namespace";

import { JSX } from "./namespace";
import {
  isViewNodeConstructor,
  ViewNode,
  ViewHTMLElement,
  ViewSVGElement,
  ViewComponent,
} from "@lizzi/template";
import { isSvgTag } from "./SvgTags";

export const jsx = <T extends ViewNode>(
  type: string | T,
  props: {
    [k: string]: any;
    children: any;
  }
) => {
  return jsxs<T>(type, props);
};

export const jsxs = <T extends ViewNode>(
  type: string | T,
  props: {
    svg?: boolean | undefined;
    children: JSX.Childrens;
    [k: string]: any;
  }
) => {
  if (typeof type === "string") {
    if (isSvgTag.has(type as any) || props.svg) {
      return new ViewSVGElement(type as any, props);
    }

    return new ViewHTMLElement(type as any, props);
  } else if (typeof type === "function") {
    if (type[isViewNodeConstructor]) {
      return new (type as new (props: object) => T)(props);
    }

    return (type as (props: object) => T)(props);
  } else {
    throw new Error(
      "JSX constructor should be string, HTML tag or ViewNode constructor"
    );
  }
};

export const Fragment = ViewComponent;
