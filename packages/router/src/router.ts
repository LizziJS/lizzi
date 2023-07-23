/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { EventWrapper, Locker, addListener, zz, zzEvent } from "@lizzi/core";
import { zzUrl } from ".";

type TUrl = string | Array<string>;

export class zzUrlRouter extends zzUrl {
  protected destructor = zz.Destructor();

  convertToUrl(url: TUrl): string {
    return "/" + (Array.isArray(url) ? url.join("/") : url);
  }

  go(url: TUrl): void {
    this.value = this.convertToUrl(url);
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
