import { zzReactive } from "@lizzi/core";
import { ViewNode, ViewElement } from "@lizzi/template";

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
    use?: Array<(view: ViewElement<AllElementsTagName[T]>) => void>;
    [key: string]: any;
  }

  type Children = ViewNode | string | number | boolean | zzReactive<any>;

  type Childrens = Array<Children> | Children;

  type FuncChildrens<T extends ViewNode> = Childrens | ((node: T) => ViewNode);

  type ChildrenProps = {
    children: Childrens;
  };

  type PropsWithChildren<P extends object = {}> = P & ChildrenProps;

  interface ElementClass extends ViewNode {}
  interface ElementChildrenAttribute {
    children: {};
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
