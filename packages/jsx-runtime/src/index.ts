export * from "./namespace";

import { JSX } from "./namespace";
import {
  ViewComponent,
  ViewHtmlElement,
  ViewSvgElement,
} from "@lizzi/template";
import { isSvgTag } from "./SvgTags";
import { isNodeConstructor, zzNode } from "@lizzi/node";

export const jsx = <T extends zzNode>(
  type: string | T,
  props: {
    [k: string]: any;
    children: any;
  }
) => {
  return jsxs<T>(type, props);
};

export const jsxs = <T extends zzNode>(
  type: string | T,
  props: {
    svg?: boolean | undefined;
    children: JSX.Childrens;
    [k: string]: any;
  }
) => {
  if (typeof type === "string") {
    if (isSvgTag.has(type as any) || props.svg) {
      return new ViewSvgElement(type as any, props);
    }

    return new ViewHtmlElement(type as any, props);
  } else if (typeof type === "function") {
    if (type[isNodeConstructor]) {
      return new (type as new (props: object) => T)(props);
    }

    return (type as (props: object) => T)(props);
  } else {
    throw new Error(
      "JSX constructor should be string, HTML tag or zzNode constructor"
    );
  }
};

export const Fragment = ViewComponent;
