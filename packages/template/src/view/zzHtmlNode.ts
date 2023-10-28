/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zzReadonlyArray,
  zzReactive,
  ReactiveEventChange,
  zzArray,
  zzString,
  zzReadonly,
} from "@lizzi/core";
import { ArrayView, zzNode } from "@lizzi/node";
import { JSX } from "@lizzi/jsx-runtime";

export class zzHtmlNode<E extends Node = Element> extends zzNode {
  readonly element: E;

  constructor(node: E, { children }: { children?: JSX.Children } = {}) {
    super();

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

    if (children) {
      this.append(children);
    }
  }
}

export class TextNodeView extends zzHtmlNode<Text> {
  constructor({
    children,
  }: {
    children:
      | string
      | number
      | boolean
      | zzReadonly<any>
      | Array<string | number | boolean | zzReadonly<any>>;
  }) {
    super(document.createTextNode(""));

    if (Array.isArray(children)) {
      this.onMount(() => {
        const array = new zzArray(children).join(new zzString(""));

        array.onChange
          .addListener((ev) => {
            this.element.data = String(ev.value);
          })
          .run(ReactiveEventChange.new(array));
      });
    } else if (zzReactive.isReactive(children)) {
      this.onMount(() => {
        children.onChange
          .addListener((ev) => {
            this.element.data = String(ev.value);
          })
          .run(ReactiveEventChange.new(children));
      });
    } else {
      this.element.data = String(children);
    }
  }
}

export class ValueView extends zzNode {
  constructor({ children }: { children: zzReadonly<any> }) {
    super();

    if (zzArray.isArray(children)) {
      throw new TypeError("Value children can't be array");
    }

    let isTextNow = false;

    this.onMount(() => {
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
        .run(ReactiveEventChange.new(children));

      this.onceUnmount(() => (isTextNow = false));
    });
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
    return new ValueView({ children });
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
