/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import { AttributeLink, ClassLink, StyleLink } from "./use/attributes";
import { ViewNode } from "../view/ViewNode";
import { JSX } from "@lizzi/jsx-runtime";

export * from "./use";

export type DOMAttributes<T extends DomElementView> = {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: Array<(view: T) => void>;
  children?: JSX.Childrens;
  [key: string]: any;
};

export class DomElementView<T extends Element = Element> extends ViewNode {
  readonly element: T;

  constructor(element: T) {
    super();

    this.element = element;
    this.setNodes([this.element]);
  }

  protected _appendElement(view: ViewNode, beforeViewNode: ViewNode | null) {
    const nodes = view.getNodes();
    const before = beforeViewNode ? beforeViewNode.getFirstNode() : null;
    for (let node of nodes) {
      this.element.insertBefore(node, before);
    }
  }

  getNodes() {
    return this._elements;
  }

  getFirstNode(): T {
    return this.element;
  }

  protected _createElement(tagName: string): T {
    throw new Error("rewrite _createElement method");
  }
}

export class HtmlView<
  T extends keyof HTMLElementTagNameMap
> extends DomElementView<HTMLElementTagNameMap[T]> {
  constructor(tagName: T, attributes: DOMAttributes<HtmlView<T>>) {
    super(document.createElement(tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: DOMAttributes<HtmlView<T>>) {
    for (let name in attributes) {
      switch (name.toLocaleLowerCase()) {
        case "children": {
          break;
        }
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
        case "use": {
          for (let useFn of attributes.use as any) {
            this.onMount(useFn);
          }
          break;
        }
        default: {
          if (name.startsWith("on") && typeof attributes[name] === "function") {
            console.warn(
              `using ${name} is deprecated,\nuse 'use={[onEvent('${name
                .toLocaleLowerCase()
                .slice(2)}', event_function]}' instread`
            );
            //this.onMount(onEvent(name.toLocaleLowerCase(), attributes[name]));
            break;
          }
          this.onMount(AttributeLink(name, attributes[name]) as any);
        }
      }
    }
  }
}

export class SvgView<
  T extends keyof SVGElementTagNameMap
> extends DomElementView<SVGElementTagNameMap[T]> {
  constructor(tagName: T, attributes: DOMAttributes<SvgView<T>>) {
    super(document.createElementNS("http://www.w3.org/2000/svg", tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: DOMAttributes<SvgView<T>>) {
    for (let name in attributes) {
      switch (name.toLocaleLowerCase()) {
        case "children": {
          break;
        }
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
        case "use": {
          for (let useFn of attributes.use as any) {
            this.onMount(useFn);
          }
          break;
        }
        default: {
          if (name.startsWith("on") && typeof attributes[name] === "function") {
            console.warn(
              `using ${name} is deprecated, use 'use={[onEvent('${name
                .toLocaleLowerCase()
                .slice(2)}', event_function)]}' instread`
            );
            //this.onMount(onEvent(name.toLocaleLowerCase(), attributes[name]));
            break;
          }
          this.onMount(AttributeLink(name, attributes[name]));
        }
      }
    }
  }
}
