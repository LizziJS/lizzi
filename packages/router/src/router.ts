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
  protected currentState = zz.Object<{ [key: string]: any }>();

  getState(name: string): any {
    return zz.Compute(() => {
      const currentState = this.currentState.value;

      return currentState ? currentState[name] ?? null : null;
    });
  }

  pushState(state: { [key: string]: any }): void {
    window.history.pushState(state, "", this.value);
    this.currentState.value = state;
  }

  setState(state: { [key: string]: any }): void {
    window.history.replaceState(state, "", this.value);
    this.currentState.value = state;
  }

  go(url: TUrl, state: { [key: string]: any } | null = null): void {
    const stringUrl = convertToUrl(url);

    window.history.pushState(state, "", stringUrl);
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
        locker((ev: PopStateEvent) => {
          this.value = window.location.href;
          this.currentState.value = ev.state;
        })
      )
    );

    this.onChange.addListener(
      locker((ev) => {
        this.go(ev.value);
      })
    );
  }
}
