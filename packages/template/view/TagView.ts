/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import { AttributeLink, ClassLink, StyleLink } from "../use/attributes";
import { ViewNode } from "./ViewNode";

export type TagAttributes = {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  [key: string]: any;
};

export class DomElementView<T extends Element = Element> extends ViewNode {
  readonly element: T;

  constructor(tagName: string) {
    super();

    this.element = this._createElement(tagName);
    this.setNodeElements([this.element]);
  }

  protected _appendElement(view: ViewNode, beforeViewNode: ViewNode | null) {
    const nodes = view.getElements();
    const before = beforeViewNode ? beforeViewNode.getFirstElement() : null;
    for (let node of nodes) {
      this.element.insertBefore(node, before);
    }
  }

  getElements() {
    return this._elements;
  }

  getFirstElement(): T {
    return this.element;
  }

  protected _createElement(tagName: string): T {
    throw new Error("rewrite _createElement method");
  }

  apply(...mountFn: ((view: this) => void)[]) {
    for (let useFn of mountFn) {
      this.onMount(useFn);
    }

    return this;
  }
}

export class HtmlView<
  T extends keyof HTMLElementTagNameMap
> extends DomElementView<HTMLElementTagNameMap[T]> {
  constructor(
    tagName: T,
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) {
    super(tagName);

    this.append(childrens);

    this._initAttributes(attributes);
  }

  protected _createElement(tagName: T): HTMLElementTagNameMap[T] {
    return document.createElement(tagName);
  }

  protected _initAttributes(attributes: TagAttributes) {
    for (let name in attributes) {
      switch (name.toLocaleLowerCase()) {
        case "class": {
          this.onMount(ClassLink(attributes.class as any));
          break;
        }
        case "style": {
          for (let styleName in attributes.style as any) {
            this.onMount(
              StyleLink(styleName, (attributes.style as any)[styleName])
            );
          }
          break;
        }
        default: {
          this.onMount(AttributeLink(name, attributes[name]) as any);
        }
      }
    }
  }
}

export class SvgView<
  T extends keyof SVGElementTagNameMap
> extends DomElementView<SVGElementTagNameMap[T]> {
  constructor(
    tagName: T,
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) {
    super(tagName);

    this.append(childrens);

    this._initAttributes(attributes);
  }

  protected _createElement(tagName: T): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
  }

  protected _initAttributes(attributes: TagAttributes) {
    for (let name in attributes) {
      switch (name.toLocaleLowerCase()) {
        case "class": {
          this.onMount(ClassLink(attributes.class as any));
          break;
        }
        case "style": {
          for (let styleName in attributes.style as any) {
            this.onMount(
              StyleLink(styleName, (attributes.style as any)[styleName])
            );
          }
          break;
        }
        default: {
          this.onMount(AttributeLink(name, attributes[name]));
        }
      }
    }
  }
}
