/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue, zzReadonlyArray, zzReactive } from "@lizzi/core";
import { zzNode, PropsWithUse } from "@lizzi/node";
import { JSX } from "@lizzi/jsx-runtime";

export type zzHtmlNodeProps<TNode extends zzHtmlNode<any>> = PropsWithUse<
  {
    children?: JSX.Children;
    [key: string]: any;
  },
  TNode
>;

export class zzHtmlNode<E extends Node = Element> extends zzNode<
  zzHtmlNodeProps<zzHtmlNode<E>>
> {
  readonly element: E;

  constructor(node: E, props: zzHtmlNodeProps<zzHtmlNode<E>> = {}) {
    super(props);

    this.element = node;

    this.flatChildInstances(zzHtmlNode).itemsListener(
      (added, index) => {
        const beforeElement = this.element.childNodes.item(index);

        this.element.insertBefore(added.element, beforeElement);
      },
      (removed) => {
        this.element.removeChild(removed.element);
      }
    );
  }
}

export class ReactiveValueView extends zzNode {
  constructor({ children }: { children: zzReactive<any> }) {
    super({});

    let isTextNow = false;

    this.addToMount(() => {
      children.onChange
        .addListener((ev) => {
          if (ev.value === null) {
            this.childNodes.removeAll();
            isTextNow = false;
          } else if (zzNode.isNode(ev.value)) {
            this.childNodes.removeAll();
            this.childNodes.add([ev.value]);
            isTextNow = false;
          } else if (!isTextNow) {
            this.childNodes.removeAll();
            this.childNodes.add([new TextNodeView({ children })]);
            isTextNow = true;
          }
        })
        .run(EventChangeValue.new(children));

      this.onceUnmount(() => (isTextNow = false));
    });
  }
}

export class ArrayView<T extends zzNode> extends zzNode {
  constructor({ children }: { children: zzReadonlyArray<T> | T[] }) {
    super({});

    if (zzReadonlyArray.isArray(children)) {
      this.addToMount(() => {
        children
          .map((child) => JSXChildrenToNodeMapper(child))
          .filter((view) => view !== null && view !== undefined)
          .itemsListener(
            (added, index) => {
              this.childNodes.add([added], index);
            },
            (removed) => {
              this.childNodes.remove([removed]);
            }
          );
      });
    } else {
      this.childNodes.add(
        children
          .map((child) => JSXChildrenToNodeMapper(child))
          .filter((view) => view !== null && view !== undefined) as any
      );
    }
  }
}

export class TextNodeView extends zzHtmlNode<Text> {
  constructor({
    children,
  }: {
    children: string | number | boolean | zzReactive<any>;
  }) {
    super(document.createTextNode(""));

    if (zzReactive.isReactive(children)) {
      this.onMount(() => {
        children.onChange
          .addListener((ev) => {
            this.element.data = String(ev.value);
          })
          .run(EventChangeValue.new(children));
      });
    } else {
      this.element.data = String(children);
    }
  }
}

export const JSXChildrenToNodeMapper = (
  children: JSX.Values | zzNode
): zzNode => {
  if (zzReadonlyArray.isArray(children) || Array.isArray(children)) {
    return new ArrayView({ children });
  }

  if (
    typeof children === "boolean" ||
    typeof children === "string" ||
    typeof children === "number"
  ) {
    return new TextNodeView({ children });
  }

  if (zzReactive.isReactive(children)) {
    return new ReactiveValueView({ children });
  }

  return children;
};

export const MapJSXChildrensToNodes = (childrens: JSX.Children): zzNode[] => {
  if (Array.isArray(childrens)) {
    return childrens
      .map((child) => JSXChildrenToNodeMapper(child))
      .filter((view) => view);
  }

  return [JSXChildrenToNodeMapper(childrens)].filter((view) => view);
};
