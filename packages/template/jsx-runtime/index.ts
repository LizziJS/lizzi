import { zzArray, zzObject, zzReactive } from "@lizzi/core";
import { isViewNodeConstructor, ViewNode } from "../view/ViewNode";
import { isSvgTag } from "../DOM/SvgTags";
import { DomElementView, HtmlView, SvgView } from "../DOM";
import { reactiveViews } from "../view/ReactiveView";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

interface JSXAttributes<T extends keyof AllElementsTagName> {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: Array<(view: DomElementView<AllElementsTagName[T]>) => void>;
  children?: Array<string | number>;
  [key: string]: any;
}

export declare namespace JSX {
  type Element = ViewNode;
  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSXAttributes<T>;
  };
}

export const jsx = (
  type: string | ViewNode,
  props: {
    [k: string]: any;
    children: any;
  }
): ViewNode => {
  props.children = props.children === undefined ? [] : [props.children];

  return jsxs(type, props);
};

const viewNodeMapper = (
  element:
    | ViewNode
    | string
    | number
    | boolean
    | Array<any>
    | zzArray<any>
    | zzObject<any>
    | zzReactive<any>
): ViewNode => {
  if (element instanceof zzArray || Array.isArray(element)) {
    return reactiveViews.Array(element);
  }

  if (element instanceof zzObject) {
    return reactiveViews.Object(element);
  }

  if (
    typeof element === "boolean" ||
    typeof element === "string" ||
    typeof element === "number" ||
    element instanceof zzReactive
  ) {
    return reactiveViews.Text(element);
  }

  return element;
};

export const jsxs = (
  type: string | ViewNode,
  props: {
    svg?: boolean | undefined;
    children: Array<any>;
    [k: string]: any;
  }
): ViewNode => {
  props.children = props.children.map(viewNodeMapper);

  if (typeof type === "string") {
    if (type in isSvgTag || props.svg) {
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
