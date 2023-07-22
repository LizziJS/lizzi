/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue, zzReadonlyArray, zzReactive } from "@lizzi/core";
import { zzNode, ComponentUse } from "@lizzi/node";
import { JSX } from "@lizzi/jsx-runtime";
import { flatChildInstanceNodes } from "../..";

export type zzHtmlComponentProps<T extends zzNode> = {
  children?: JSX.FuncChildrens<T>;
  use?: ComponentUse<T>;
  [key: string]: any;
};

export class zzHtmlComponent extends zzNode {
  protected readonly _children?: JSX.FuncChildrens<this>;

  constructor({
    children,
    use = [],
  }: zzHtmlComponentProps<zzHtmlComponent> = {}) {
    super({ use });

    this._children = children;
  }

  get children() {
    //check children is function and call it
    return typeof this._children === "function"
      ? this._children(this)
      : this._children;
  }

  append(childrens?: JSX.Childrens) {
    if (Array.isArray(childrens)) {
      const viewNodes = childrens
        .map((child) => JSXChildrenToNodeMapper(child))
        .filter((view) => view);

      super.append(viewNodes);
    } else if (childrens) {
      const view = JSXChildrenToNodeMapper(childrens);
      if (view) {
        super.append(view);
      }
    }

    return this;
  }
}

export class zzHtmlNode<E extends Node = Element> extends zzHtmlComponent {
  readonly element: E;

  constructor(node: E, props: zzHtmlComponentProps<zzHtmlNode<E>> = {}) {
    super(props);

    this.element = node;

    flatChildInstanceNodes(this.childNodes, zzHtmlNode).itemsListener(
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
        .run(EventChangeValue.new(children));

      this.onceUnmount(() => (isTextNow = false));
    });
  }
}

export class ArrayView<T extends zzNode> extends zzNode {
  constructor({ children }: { children: zzReadonlyArray<T> | T[] }) {
    super();

    if (zzReadonlyArray.isArray(children)) {
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
      this.childNodes.add(children as any);
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

export const JSXChildrenToNodeMapper = (children: JSX.Children): zzNode => {
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

export const MapJSXChildrensToNodes = (childrens: JSX.Childrens): zzNode[] => {
  if (Array.isArray(childrens)) {
    return childrens
      .map((child) => JSXChildrenToNodeMapper(child))
      .filter((view) => view);
  }

  return [JSXChildrenToNodeMapper(childrens)].filter((view) => view);
};
