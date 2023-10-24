export * from "./namespace";

import { JSX } from "./namespace";
import { HtmlElementView, SvgElementView } from "@lizzi/template";
import { isSvgTag } from "./SvgTags";
import { isNodeConstructor, zzNode } from "@lizzi/node";
import { zzGetReactiveObserver } from "@lizzi/core";

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
    children: JSX.Children;
    [k: string]: any;
  }
) => {
  let result: any;

  zzGetReactiveObserver.runIsolated(() => {
    if (typeof type === "string") {
      if (isSvgTag.has(type as any) || props.svg) {
        result = new SvgElementView(type as any, props);
        return;
      }

      result = new HtmlElementView(type as any, props);
      return;
    } else if (typeof type === "function") {
      if (type[isNodeConstructor]) {
        result = new (type as new (props: object) => T)(props);
        return;
      }

      result = (type as (props: object) => T)(props);
      return;
    } else {
      throw new Error(
        "JSX constructor should be string, HTML tag or zzNode constructor"
      );
    }
  });

  return result as T;
};

export class Fragment extends zzNode {}
