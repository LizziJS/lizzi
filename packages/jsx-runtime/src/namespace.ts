import { zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";
import { zzHtmlNode } from "@lizzi/template";

type AllElementsTagName = HTMLElementTagNameMap & SVGElementTagNameMap;

export declare namespace JSX {
  interface Element extends zzNode {}

  type Values = string | number | boolean | zzReactive<any>;

  type FuncChildrenTypes<T extends zzNode> = <TNode extends T>(
    node: TNode
  ) => zzNode;

  type Children<TNodeType = zzNode | Values> = TNodeType | Array<TNodeType>;

  type ChildrenFunction<T extends zzNode> = Children | FuncChildrenTypes<T>;

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
    use?:
      | Array<(view: zzHtmlNode<AllElementsTagName[T]>) => void>
      | ((view: zzHtmlNode<AllElementsTagName[T]>) => void);
    [key: string]: any;
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
