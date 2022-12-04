/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import { AttributeLink, ClassLink, StyleLink } from "./attributes";
import { ViewNode } from "../view/ViewNode";
import { JSX } from "@lizzi/jsx-runtime";

export type ElementAttributes<T extends ViewElement> = {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: Array<(view: T) => void>;
  children?: JSX.Childrens;
  [key: string]: any;
};

export class ViewElement<T extends Element = Element> extends ViewNode {
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

export class ViewHtmlElement<
  T extends keyof HTMLElementTagNameMap
> extends ViewElement<HTMLElementTagNameMap[T]> {
  constructor(tagName: T, attributes: ElementAttributes<ViewHtmlElement<T>>) {
    super(document.createElement(tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: ElementAttributes<ViewHtmlElement<T>>) {
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

export class ViewSvgElement<
  T extends keyof SVGElementTagNameMap
> extends ViewElement<SVGElementTagNameMap[T]> {
  constructor(tagName: T, attributes: ElementAttributes<ViewSvgElement<T>>) {
    super(document.createElementNS("http://www.w3.org/2000/svg", tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: ElementAttributes<ViewSvgElement<T>>) {
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
