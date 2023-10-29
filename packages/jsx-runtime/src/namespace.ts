import { IReadOnlyReactive } from "@lizzi/core";
import { zzHtmlNode } from "@lizzi/template";
import { zzNode } from "@lizzi/node";

export declare namespace JSX {
  interface Element extends zzNode {}

  type Values = string | number | boolean | IReadOnlyReactive<any>;

  type FuncChildrenTypes<T extends zzNode> = <TNode extends T>(
    node: TNode
  ) => zzNode;

  type Children = zzNode | Array<zzNode>;

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

  interface Fragment {
    new (props: { children: Children }): zzNode;
  }
}

type AllElementsTagName = HTMLElementTagNameMap &
  SVGElementTagNameMap & { [key: string]: HTMLElement };

export declare namespace JSX {
  interface Attributes<T extends keyof AllElementsTagName> {
    class?:
      | Array<string | IReadOnlyReactive<any>>
      | string
      | IReadOnlyReactive<any>;
    style?: {
      [key: string]:
        | Array<string | IReadOnlyReactive<any>>
        | string
        | number
        | IReadOnlyReactive<any>;
    };
    use?:
      | Array<(view: zzHtmlNode<AllElementsTagName[T]>) => void>
      | ((view: zzHtmlNode<AllElementsTagName[T]>) => void);
    children?: Children;
    [key: string]: any;
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
