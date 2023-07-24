/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { Locker, addListener, zz } from "@lizzi/core";
import { zzUrl } from ".";

export type UrlArray = Array<string>;
type TUrl = string | UrlArray;

export function convertToUrl(url: TUrl): string {
  return "/" + (Array.isArray(url) ? url.join("/") : url).replace(/^\/+/g, "");
}

export class zzUrlRouter extends zzUrl {
  protected destructor = zz.Destructor();

  go(url: TUrl): void {
    this.value = convertToUrl(url);
  }

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }

  goHome(): void {
    this.value = window.location.origin;
  }

  destroy(): void {
    super.destroy();
    this.destructor.destroy();
  }

  constructor() {
    super(window.location.href);

    const locker = Locker.new();

    this.destructor.add(
      addListener(
        window,
        "popstate",
        locker(() => {
          this.value = window.location.href;
        })
      )
    );

    this.onChange.addListener(
      locker((ev) => {
        window.history.pushState(null, "", ev.value);
      })
    );
  }
}
