import { zzReactive, zzReadonly } from "@lizzi/core";
import { zzHtmlNode } from "@lizzi/template";
import { zzNode } from "@lizzi/node";

export declare namespace JSX {
  interface Element extends zzNode {}

  type Values = string | number | boolean | zzReadonly<any>;

  type FuncChildrenTypes<T extends zzNode> = <TNode extends T>(
    node: TNode
  ) => zzNode;

  type Children<TNodeType = zzNode> = zzNode | Array<zzNode>;

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

type AllElementsTagName = HTMLElementTagNameMap &
  SVGElementTagNameMap & { [key: string]: HTMLElement };

export declare namespace JSX {
  interface Attributes<T extends keyof AllElementsTagName> {
    class?: Array<string | zzReadonly<any>> | string | zzReadonly<any>;
    style?: {
      [key: string]:
        | Array<string | zzReadonly<any>>
        | string
        | number
        | zzReadonly<any>;
    };
    use?:
      | Array<(view: zzHtmlNode<AllElementsTagName[T]>) => void>
      | ((view: zzHtmlNode<AllElementsTagName[T]>) => void);
    children?: Children<AllElementsTagName[T]>;
    [key: string]: any;
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
