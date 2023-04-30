/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core";
import { AttributeLink, ClassLink, StyleLink } from "./attributes";
import { JSX } from "@lizzi/jsx-runtime";
import { zzHtmlNode } from "../view/zzHtmlNode";

export type ElementAttributes<T extends zzHtmlNode> = {
  class?: Array<string | zzReactive<any>>;
  style?: { [key: string]: Array<string | zzReactive<any>> };
  use?: Array<(view: T) => void>;
  children?: JSX.Childrens;
  [key: string]: any;
};

export class HtmlElementView<
  T extends keyof HTMLElementTagNameMap
> extends zzHtmlNode<HTMLElementTagNameMap[T]> {
  constructor(tagName: T, attributes: ElementAttributes<HtmlElementView<T>>) {
    super(document.createElement(tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: ElementAttributes<HtmlElementView<T>>) {
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
                .slice(2)}', event_function)]}' instread`
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

export class SvgElementView<
  T extends keyof SVGElementTagNameMap
> extends zzHtmlNode<SVGElementTagNameMap[T]> {
  constructor(tagName: T, attributes: ElementAttributes<SvgElementView<T>>) {
    super(document.createElementNS("http://www.w3.org/2000/svg", tagName));

    this.append(attributes.children);

    this._initAttributes(attributes);
  }

  protected _initAttributes(attributes: ElementAttributes<SvgElementView<T>>) {
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
              `using ${name} is deprecated,\nuse 'use={[on('${name
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
