import { zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";
import { zzHtmlNode } from "@lizzi/template";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

export declare namespace JSX {
  interface Element extends zzNode {}

  type NodeChildrenTypes = zzNode;
  type ValueChildrenTypes = string | number | boolean | zzReactive<any>;
  type NodeChildren = NodeChildrenTypes | Array<NodeChildrenTypes>;

  type Children =
    | Array<NodeChildrenTypes | ValueChildrenTypes>
    | NodeChildrenTypes
    | ValueChildrenTypes;

  type ChildrenFunction<T extends zzNode> =
    | Children
    | (<TNode extends T>(node: TNode) => zzNode);

  type PropsWithChildren<Props extends object = {}> = Props & {
    children: Children;
  };

  type PropsWithChildrenFunction<
    TNodeComponent extends zzNode,
    Props extends object = {}
  > = Props & {
    children: ChildrenFunction<TNodeComponent>;
  };

  interface ElementClass extends zzNode {}
  interface ElementChildrenAttribute {
    children: {};
  }
}

export declare namespace JSX {
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

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
