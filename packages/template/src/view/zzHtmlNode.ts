/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventChangeValue, zzArrayInstance, zzReactive } from "@lizzi/core";
import { zzNode } from "@lizzi/node";
import { JSX } from "@lizzi/jsx-runtime";

export class zzHtmlComponent extends zzNode {
  constructor({ children }: { children?: JSX.Childrens } = {}) {
    super();

    this.append(children);
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

export class zzHtmlNode<
  THtmlNode extends Node = Element
> extends zzHtmlComponent {
  readonly element: THtmlNode;

  constructor(node: THtmlNode) {
    super();

    this.element = node;

    this._initChildMap();
  }

  protected _initChildMap() {
    type MapT = Node | zzArrayInstance<MapT>;

    const mapNodes = (node: zzNode): MapT => {
      if (node instanceof zzHtmlNode) {
        return node.element;
      }

      return node.childNodes.map(mapNodes);
    };

    const _childNodes = this.childNodes.map(mapNodes).flat();

    _childNodes.onAdd.addListener((ev) => {
      const beforeElement = this.element.childNodes.item(ev.index);

      this.element.insertBefore(ev.added, beforeElement);
    });

    _childNodes.onRemove.addListener((ev) => {
      this.element.removeChild(ev.removed);
    });
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
