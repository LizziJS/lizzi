/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import { AttributeLink, ClassLink, StyleLink } from "./attributes";
import { JSX } from "@lizzi/jsx-runtime";
import { zzHtmlNode } from "../view/zzHtmlNode";
import { on } from "../..";
import { UseNode } from "@lizzi/node";

export type ElementAttributes<T extends zzHtmlNode> = {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: UseNode<T>;
  children?: JSX.Children;
  [key: string]: any;
};

export class HtmlElementView<
  T extends keyof HTMLElementTagNameMap
> extends zzHtmlNode<HTMLElementTagNameMap[T]> {
  constructor(
    tagName: T,
    { children, use, ...attributes }: ElementAttributes<HtmlElementView<T>>
  ) {
    super(document.createElement(tagName), { use, children });

    this.initProps(attributes);
  }

  protected initProps(attributes: ElementAttributes<this>) {
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
          if (name.startsWith("on") && typeof attributes[name] === "function") {
            this.onMount(
              on(name.toLocaleLowerCase().slice(2), attributes[name])
            );
            break;
          }
          this.onMount(AttributeLink(name, attributes[name]) as any);
        }
      }
    }
  }
}

export class SvgElementView<
  T extends keyof SVGElementTagNameMap
> extends zzHtmlNode<SVGElementTagNameMap[T]> {
  constructor(
    tagName: T,
    {
      children,
      use,
      ...attributes
    }: ElementAttributes<zzHtmlNode<SVGElementTagNameMap[T]>>
  ) {
    super(document.createElementNS("http://www.w3.org/2000/svg", tagName), {
      children,
      use,
    });

    this.initProps(attributes);
  }

  protected initProps(attributes: ElementAttributes<this>) {
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
          if (name.startsWith("on") && typeof attributes[name] === "function") {
            this.onMount(
              on(name.toLocaleLowerCase().slice(2), attributes[name])
            );
            break;
          }
          this.onMount(AttributeLink(name, attributes[name]));
        }
      }
    }
  }
}
