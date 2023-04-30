/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  DestructorsStack,
  addListener,
  zzDestructor,
  zzString,
} from "@lizzi/core";

export class zzRouter extends zzDestructor {
  readonly destructor = new DestructorsStack();
  readonly url = new zzString();

  destroy(): void {
    this.destructor.destroy();
  }

  protected getPath(path: string) {
    return (
      "/" +
      path
        .trim()
        .replace(/[\/\\]+/g, "/")
        .replace(/^\/+|\/+$/g, "")
    );
  }

  go(url?: string) {
    this.url.value = this.getPath(url ?? window.location.pathname);
  }

  constructor() {
    super();

    this.go();

    this.destructor.add(
      addListener(window, "popstate", (event: PopStateEvent) => {
        this.url.value = event.state.url;
      }),
      this.url.onChange.addListener((event) => {
        window.history.pushState({ url: event.value }, "", event.value);
      })
    );
  }
}
