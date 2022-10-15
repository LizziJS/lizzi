/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "@lizzi/core/Event";

export type RouteParams = { [key: string]: string };

export class zzRouter {
  readonly onChangeRoute = new zzEvent<(path: string) => void>();

  path: string;
  state: RouteParams;

  protected trimPath(path: string) {
    return path
      .trim()
      .replace(/[\/\\]+/g, "/")
      .replace(/^\/+|\/+$/g, "");
  }

  toUrl(route: Array<string> | string) {
    if (Array.isArray(route)) {
      route = route
        .map(function (route) {
          if (typeof route === "string" || typeof route === "number") {
            return route;
          }

          return "";
        })
        .join("/");
    }

    if (typeof route === "string") {
      return this.trimPath(route);
    }

    return "";
  }

  protected __zzOnRoute() {
    this.path = "/" + this.toUrl(window.location.pathname);
    this.onChangeRoute.emit(this.path);
  }

  go(url: string) {
    this.state = { url: url };
    window.history.pushState(this.state, "", "/" + this.toUrl(url));
    this.__zzOnRoute();
  }

  setState(object: RouteParams) {
    for (let name in object) {
      this.state[name] = object[name];
    }

    window.history.replaceState(this.state, "", window.location.href);
  }

  constructor() {
    window.addEventListener("popstate", (event) => {
      this.state = event.state;
      this.__zzOnRoute();
    });
    this.path = "/" + this.toUrl(window.location.pathname);

    this.state = {};
    this.setState({ url: window.location.pathname });
  }
}

export const AppRouter = new zzRouter();
