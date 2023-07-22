import { zzEvent, zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";
import { zzHtmlNode } from "@lizzi/template";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

export declare namespace JSX {
  interface Element extends zzNode {}

  interface Attributes<T extends keyof AllElementsTagName> {
    class?:
      | Array<
          | string
          | zzReactive<any>
          | ((view: zzHtmlNode<AllElementsTagName[T]>) => string)
        >
      | string
      | zzReactive<any>
      | ((view: zzHtmlNode<AllElementsTagName[T]>) => string);
    style?: {
      [key: string]:
        | ((view: zzHtmlNode<AllElementsTagName[T]>) => string)
        | Array<string | zzReactive<any>>
        | string
        | number
        | zzReactive<any>;
    };
    use?: Array<(view: zzHtmlNode<AllElementsTagName[T]>) => void>;
    [key: string]: any;
  }

  type Children = zzNode | string | number | boolean | zzReactive<any>;

  type Childrens = Array<Children> | Children;

  type FuncChildrens<T extends zzNode> =
    | Childrens
    | (<TNode extends T>(node: TNode) => zzNode);

  type zzEventProps<T extends zzNode> = {
    [K in keyof T]: T[K] extends zzEvent<any>
      ? Parameters<T[K]["addListener"]>[0]
      : never;
  };

  type ChildrenProps<T extends zzNode> = {
    children: FuncChildrens<T>;
  };

  type PropsWithChildren<P extends object = {}> = P & {
    children: Childrens;
  };

  type PropsWithFuncChildren<T extends zzNode, P extends object = {}> = P & {
    children: FuncChildrens<T>;
  };

  interface ElementClass extends zzNode {}
  interface ElementChildrenAttribute {
    children: {};
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
