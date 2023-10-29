/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zzReadonlyArray,
  zzReactive,
  ReactiveEventChange,
  zzReadonly,
  IReadOnlyReactive,
} from "@lizzi/core";
import { ArrayView, zzNode } from "@lizzi/node";
import { JSX } from "@lizzi/jsx-runtime";
import { NodeDebug } from "@lizzi/node/src/debug";

export class zzHtmlNode<E extends Node = Element> extends zzNode {
  readonly element: E;

  get debugName() {
    return "<" + this.element.nodeName.toLocaleLowerCase() + ">";
  }

  constructor(node: E, { children }: { children?: JSX.Children } = {}) {
    super();

    this.element = node;

    this._initDebugLevel();

    if (children) {
      this.append(children);
    }

    this.initFlatChildInstances();
  }

  protected _initDebugLevel(): void {
    if (this.element) {
      this.childNodes.change(NodeDebug.trace(`${this.debugName}.childNodes`));
    }
  }

  protected initFlatChildInstances() {
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

export class TextNodeView extends zzHtmlNode<Text> {
  constructor({
    children,
  }: {
    children: string | number | boolean | IReadOnlyReactive<any>;
  }) {
    super(document.createTextNode(""));

    if (zzReactive.isReactive(children)) {
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

  protected initFlatChildInstances() {}
}

export class ReactiveView extends zzNode {
  constructor({ children }: { children: IReadOnlyReactive<any> }) {
    super();

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

      this.onceUnmount(() => {
        this.childNodes.removeAll();

        isTextNow = false;
      });
    });
  }
}

export class TextView extends zzNode {
  constructor({
    children,
  }: {
    children: JSX.Values | zzNode | Array<JSX.Values | zzNode>;
  }) {
    super();

    this.append(MapJSXChildrensToNodes(children));
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

  if (zzReadonly.isReactive(children)) {
    return new ReactiveView({ children });
  }

  return children;
};

export const MapJSXChildrensToNodes = (
  childrens: JSX.Values | zzNode | Array<JSX.Values | zzNode>
): zzNode[] => {
  if (Array.isArray(childrens)) {
    return childrens
      .map((child) => JSXChildrenToNodeMapper(child))
      .filter((view) => view);
  }

  return [JSXChildrenToNodeMapper(childrens)].filter((view) => view);
};
