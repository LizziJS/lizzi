import { zzReactive } from "@lizzi/core";
import { ViewNode } from "../view/ViewNode";
import { DomElementView } from "../DOM";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

export declare namespace JSX {
  interface Element extends ViewNode {}

  interface Attributes<T extends keyof AllElementsTagName> {
    class?: Array<string | zzReactive<any>> | string | zzReactive<any>;
    style?: {
      [key: string]:
        | Array<string | zzReactive<any>>
        | string
        | number
        | zzReactive<any>;
    };
    use?: Array<(view: DomElementView<AllElementsTagName[T]>) => void>;
    [key: string]: any;
  }

  type Children<T extends ViewNode = ViewNode> =
    | ViewNode
    | string
    | number
    | boolean
    | zzReactive<any>
    | ((view: T) => ViewNode);

  type Childrens<T extends ViewNode = ViewNode> =
    | Array<Children<T>>
    | Children<T>;

  type ChildrenProps<T extends ViewNode = ViewNode> = {
    children: Childrens<T>;
  };

  type PropsWithChildren<
    P extends object = {},
    T extends ViewNode = ViewNode
  > = P & ChildrenProps<T>;

  interface ElementClass extends ViewNode {}
  interface ElementChildrenAttribute {
    children: {};
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
