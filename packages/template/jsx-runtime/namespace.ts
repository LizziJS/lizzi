import { zzReactive } from "@lizzi/core";
import { ViewNode } from "../view/ViewNode";
import { DomElementView } from "../DOM";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

interface JSXAttributes<T extends keyof AllElementsTagName> {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: Array<(view: DomElementView<AllElementsTagName[T]>) => void>;
  [key: string]: any;
}

export declare namespace JSX {
  interface Element extends ViewNode {}

  type Children = Element | string | number | boolean | zzReactive<any>;
  type Childrens = Array<Children> | Children;

  interface ElementClass extends ViewNode {}
  interface ElementChildrenAttribute {
    children: {};
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSXAttributes<T>;
  };
}
