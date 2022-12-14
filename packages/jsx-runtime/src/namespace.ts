import { zzReactive, zzSimpleEvent } from "@lizzi/core";
import { ViewNode, ViewElement } from "@lizzi/template";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

export declare namespace JSX {
  interface Element extends ViewNode {}

  interface Attributes<T extends keyof AllElementsTagName> {
    class?:
      | Array<
          | string
          | zzReactive<any>
          | ((view: ViewElement<AllElementsTagName[T]>) => string)
        >
      | string
      | zzReactive<any>
      | ((view: ViewElement<AllElementsTagName[T]>) => string);
    style?: {
      [key: string]:
        | ((view: ViewElement<AllElementsTagName[T]>) => string)
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

  type zzEventProps<T extends ViewNode> = {
    [K in keyof T]: T[K] extends zzSimpleEvent<any>
      ? Parameters<T[K]["addListener"]>[0]
      : never;
  };

  type ChildrenProps<T extends ViewNode> = {
    children: FuncChildrens<T>;
  };

  type PropsWithChildren<P extends object = {}> = P & {
    children: Childrens;
  };

  interface ElementClass extends ViewNode {}
  interface ElementChildrenAttribute {
    children: {};
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
