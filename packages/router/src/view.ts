/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray, zzBoolean, zzReactive } from "@lizzi/core";
import { zzRouter } from "./router";
import { zzNode } from "@lizzi/node";

export class RouterComponent extends zzNode {
  parentRouter: RouterComponent | null = null;
  appRouter: zzRouter | null = null;
  readonly routes = new zzArray<Route>();

  addRoute(route: Route) {
    if (!this.appRouter) throw new Error("Router not initialized");

    this.routes.add([route]);

    this.checkRoutes(this.appRouter.url.value);
  }

  removeRoute(route: Route) {
    if (!this.appRouter) throw new Error("Router not initialized");

    this.routes.remove([route]);

    this.checkRoutes(this.appRouter.url.value);
  }

  checkRoutes(path: string) {
    if (path.length === 0) {
      return true;
    }

    let found = false;
    for (const route of this.routes) {
      if (!found && route.check(path)) {
        found = true;
        continue;
      }

      route.close();
    }

    return found;
  }

  go(url: string) {
    this.appRouter?.go(url);
  }
}

export class Route extends RouterComponent {
  readonly regexp: RegExp;
  readonly params: zzReactive<any>[];
  readonly childrens;
  protected isOpened: zzBoolean;

  check(path: string) {
    let match = path.match(this.regexp);

    if (match === null) {
      this.close();

      return false;
    }

    for (let k in this.params) {
      this.params[k].value = match[Number(k) * 1 + 1];
    }

    this.open();
    if (this.checkRoutes(path.substring(match[0].length))) {
      return true;
    }

    this.close();

    return false;
  }

  open() {
    if (!this.isOpened.value) {
      this.isOpened.value = true;

      this.append(this.childrens);
    }
  }

  close() {
    if (this.isOpened.value) {
      this.isOpened.value = false;

      this.childNodes.removeAll();
    }
  }

  constructor({
    route,
    children,
  }: {
    route: Array<string | zzReactive<any>>;
    children: zzNode | zzNode[];
  }) {
    super();

    this.isOpened = new zzBoolean(false);

    this.childrens = children;
    this.params = [];

    let regexp = "^";
    for (let oneRoute of route) {
      regexp += "/";
      if (typeof oneRoute === "string") {
        let result = oneRoute.matchAll(
          /\*\*|\*|[.()\\\/+{}^$?]|([^:.()\\\/+{}^$?*]+)/gmu
        );

        for (let r of result) {
          if (r[1] !== undefined) {
            regexp += r[1];
          } else if (r[0] === "*") {
            regexp += "[^./]+";
          } else if (r[0] === "**") {
            regexp += ".*";
          } else {
            regexp += "\\" + r[0];
          }
        }
      } else {
        regexp += "([\\p{L}\\p{N}:+%_-]+)";
        this.params.push(oneRoute);
      }
    }

    this.regexp = new RegExp(regexp, "mu");

    this.onMount(() => {
      const parentNodes = this.findParentNodes(
        (node) => node instanceof RouterComponent
      ).next();

      if (parentNodes.done) {
        throw new Error("Route must be inside Router");
      }

      const parentRouter = parentNodes.value as RouterComponent;

      parentRouter.addRoute(this);

      this.onceUnmount(() => {
        parentRouter.removeRoute(this);
      });
    });
  }
}

export class Router extends RouterComponent {
  constructor({
    appRouter,
    children,
  }: {
    appRouter: zzRouter;
    children: zzNode | zzNode[];
  }) {
    super();

    this.appRouter = appRouter;

    this.append(children);

    this.onMount(() => {
      appRouter.url.onChange
        .addListener(() => {
          this.checkRoutes(appRouter.url.value);
        })
        .run();
    });
  }
}
