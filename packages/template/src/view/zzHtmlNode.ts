/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  DestructorsStack,
  EventChangeValue,
  zzReadonlyArray,
  zzReactive,
} from "@lizzi/core";
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
  protected readonly _destructor = new DestructorsStack();

  destroy(): void {
    this._destructor.destroy();
    super.destroy();
  }

  constructor(node: THtmlNode) {
    super();

    this.element = node;

    this._initChildDomMap();
  }

  protected _initChildDomMap() {
    type MapT = Node | zzReadonlyArray<MapT>;

    const mapNodes = (node: zzNode): MapT => {
      if (node instanceof zzHtmlNode) {
        return node.element;
      }

      return node.childNodes.map(mapNodes);
    };

    const _childNodes = this.childNodes.map(mapNodes).flat();

    this._destructor.add(
      _childNodes.onAdd.addListener((ev) => {
        const beforeElement = this.element.childNodes.item(ev.index);

        this.element.insertBefore(ev.added, beforeElement);
      }),

      _childNodes.onRemove.addListener((ev) => {
        this.element.removeChild(ev.removed);
      })
    );

    for (const child of _childNodes) {
      this.element.appendChild(child);
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
