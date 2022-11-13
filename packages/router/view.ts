/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzBoolean, zzReactive } from "@lizzi/core";
import { RouteState, zzRouter } from "./router";
import { ViewComponent } from "@lizzi/template";
import { JSX } from "@lizzi/template/jsx-runtime";

export class RouterComponent extends ViewComponent {
  parentRouter: RouterComponent | null = null;
  appRouter: zzRouter<any> | null = null;
  readonly routes: Route[] = [];
  protected _lastPath: string = "";

  addRoute(route: Route) {
    this.routes.push(route);

    route.parentRouter = this;
    route.appRouter = this.appRouter;

    this.checkRoutes(this._lastPath);
  }

  removeRoute(route: Route) {
    const index = this.routes.indexOf(route);
    if (index !== -1) {
      route.parentRouter = null;

      this.routes.splice(index, 1);
    }

    this.checkRoutes(this._lastPath);
  }

  checkRoutes(path: string) {
    if (path.length === 0) {
      return true;
    }

    this._lastPath = path;
    for (let index = 0; index < this.routes.length; index++) {
      if (this.routes[index].check(path)) {
        //close unchecked routes
        for (let idx = index + 1; idx < this.routes.length; idx++) {
          this.routes[idx].close();
        }

        return true;
      }
    }

    return false;
  }

  go(url: string) {
    this.appRouter?.go({ url });
  }
}

export class Route extends RouterComponent {
  readonly regexp: RegExp;
  readonly paramNames: zzReactive<any>[];
  readonly childrens?: JSX.Childrens;
  protected isOpened: zzBoolean;

  check(path: string) {
    let match = path.match(this.regexp);

    if (match === null) {
      this.close();

      return false;
    }

    for (let k in this.paramNames) {
      this.paramNames[k].value = match[Number(k) * 1 + 1];
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

      this.removeAllChilds();
    }
  }

  constructor({
    route,
    children,
  }: {
    route: Array<string | zzReactive<any>>;
    children?: JSX.Childrens;
  }) {
    super({});

    this.isOpened = new zzBoolean(false);

    this.childrens = children;
    this.paramNames = [];

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
        this.paramNames.push(oneRoute);
      }
    }

    this.regexp = new RegExp(regexp, "mu");

    this.onMount(() => {
      const pRoute = this.findParent<RouterComponent>(
        (node) => node instanceof RouterComponent
      );

      if (pRoute) {
        pRoute.addRoute(this);

        this.onceUnmount(() => pRoute.removeRoute(this));
      }
    });
  }
}

export class Router<T extends RouteState> extends RouterComponent {
  constructor({
    appRouter,
    children,
  }: {
    appRouter: zzRouter<T>;
    children: JSX.Childrens;
  }) {
    super({});

    this.appRouter = appRouter;

    this.append(children);

    this.onMount(() => {
      this.addToUnmount(
        appRouter.onUpdate
          .addListener(() => {
            this.checkRoutes(appRouter.model.url.value);
          })
          .run()
      );
    });
  }
}
