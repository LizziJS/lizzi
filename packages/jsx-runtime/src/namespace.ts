import { zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";

export declare namespace JSX {
  interface Element extends zzNode {}

  type Values = string | number | boolean | zzReactive<any>;

  type FuncChildrenTypes<T extends zzNode> = <TNode extends T>(
    node: TNode
  ) => zzNode;

  type Children<TNodeType = zzNode> = TNodeType | Array<TNodeType>;

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
