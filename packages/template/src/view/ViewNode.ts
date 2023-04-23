/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { JSX } from "@lizzi/jsx-runtime";
import { EventChangeValue, zzArrayInstance, zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";

export function findFirstChildHtmlNode(parent: zzNode): zzHtmlNode<any> | null {
  if (parent instanceof zzHtmlNode) {
    return parent;
  } else {
    for (const child of parent.childNodes) {
      const node = findFirstChildHtmlNode(child);

      if (node) {
        return node;
      }
    }
  }

  return null;
}

function findNextHtmlNode(
  nextParent: zzNode | null,
  afterElement: zzNode
): zzHtmlNode<any> | null {
  if (nextParent === null) return null;

  do {
    let childs = nextParent.childNodes.toArray();
    let index = childs.indexOf(afterElement);

    for (; index < childs.length; index++) {
      const findHtmlNode = findFirstChildHtmlNode(childs[index]);

      if (findHtmlNode) {
        return findHtmlNode;
      }
    }

    afterElement = nextParent;
    nextParent = nextParent.parentNode;
  } while (nextParent !== null && !(nextParent instanceof zzHtmlNode));

  return null;
}

export class zzHtmlNode<TElement extends Node> extends zzNode {
  readonly element: TElement;

  constructor(node: TElement) {
    super();

    this.element = node;
  }

  _setParentNode(parent: zzNode | null): void {
    if (parent === null) {
      this.element.parentNode?.removeChild(this.element);
    } else {
      const parentHtmlNode = this.findParentNodes(
        (node) => node instanceof zzHtmlNode
      ).next().value as zzHtmlNode<any> | undefined;

      if (parentHtmlNode) {
        const nextNode = findNextHtmlNode(parent, this);

        parentHtmlNode.element.insertBefore(
          this.element,
          nextNode?.element ?? null
        );
      }
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

    if (children instanceof zzReactive) {
      this.onMount(() => {
        children.onChange
          .addListener((ev) => {
            this.element.data = ev.value;
          })
          .run(EventChangeValue.new(children));
      });
    } else {
      this.element.data = String(children);
    }
  }
}

export class ReactiveValueView extends zzNode {
  constructor({ children }: { children: zzReactive<any> }) {
    super();

    let isTextNow = false;

    this.onMount(() => {
      children.onChange
        .addListener((ev) => {
          if (isTextNow === ev.value instanceof zzNode) {
            this.childNodes.removeAll();
          }

          if (ev.value instanceof zzNode) {
            this.childNodes.add([ev.value]);
            isTextNow = false;
          } else {
            this.childNodes.add([new TextNodeView({ children })]);
            isTextNow = true;
          }
        })
        .run(EventChangeValue.new(children));
    });
  }
}

export class ArrayView<T extends zzNode> extends zzNode {
  constructor({ children }: { children: zzArrayInstance<T> | T[] }) {
    super();

    if (children instanceof zzArrayInstance) {
      this.onMount(() => {
        children.onAdd.addListener((ev) => {
          this.childNodes.add([ev.added], ev.index);
        });

        children.onRemove.addListener((ev) => {
          this.childNodes.remove([ev.removed]);
        });

        this.childNodes.add(children.toArray());
      });
    } else {
      this.childNodes.add(children);
    }
  }
}

export const JSXChildrenToNodeMapper = (children: JSX.Children): zzNode => {
  if (children instanceof zzArrayInstance || Array.isArray(children)) {
    return new ArrayView({ children });
  }

  if (
    typeof children === "boolean" ||
    typeof children === "string" ||
    typeof children === "number"
  ) {
    return new TextNodeView({ children });
  }

  if (children instanceof zzReactive) {
    return new ReactiveValueView({ children });
  }

  return children;
};

export const MapJSXChildrensToNodes = (childrens: JSX.Childrens): zzNode[] => {
  if (Array.isArray(childrens)) {
    return childrens
      .map((child) => JSXChildrenToNodeMapper(child))
      .filter((view) => view);
  }

  return [JSXChildrenToNodeMapper(childrens)].filter((view) => view);
};
