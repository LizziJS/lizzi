/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { InferModel, zzModel, zzString } from "@lizzi/core";

export type RouteState = {
  url: zzString;
  [key: string]: any;
};

export class zzRouter<T extends RouteState> extends zzModel<T> {
  protected getPath(path: string) {
    return (
      "/" +
      path
        .trim()
        .replace(/[\/\\]+/g, "/")
        .replace(/^\/+|\/+$/g, "")
    );
  }

  urlToString(route: Array<string>) {
    return route
      .map((route) =>
        typeof route === "string" || typeof route === "number" ? route : ""
      )
      .join("/");
  }

  go(state: Partial<InferModel<T>>) {
    this.value = {
      ...state,
      url: this.getPath(state.url ?? window.location.pathname),
    };

    const newState = this.value;

    window.history.pushState(newState, "", newState.url);
  }

  setState(state: Partial<InferModel<T>>) {
    this.value = state;

    window.history.replaceState(this.value, "");
  }

  constructor(state: T) {
    super(state);

    window.addEventListener("popstate", (event) => {
      this.value = event.state;
    });
    this.value = { url: this.getPath(window.location.pathname) };

    this.setState(this.value);
  }
}
