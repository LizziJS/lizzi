/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzBoolean, zzReactive } from "@lizzi/core";
import { AppRouter } from "./router";
import { ViewComponent } from "../view/ViewComponent";
import { ViewNode } from "../view/ViewNode";

export class RouterComponent extends ViewComponent {
  parentRouter: RouterComponent | null = null;
  readonly routes: RouteView[] = [];
  protected _lastPath: string = "";

  addRoute(route: RouteView) {
    this.routes.push(route);

    route.parentRouter = this;

    this.checkRoutes(this._lastPath);
  }

  removeRoute(route: RouteView) {
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
}

export class RouteView extends RouterComponent {
  readonly regexp: RegExp;
  readonly paramNames: zzReactive<any>[];
  readonly childrens: ViewNode[];
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

      this.childrens.forEach((node) => this.appendChild(node));
    }
  }

  close() {
    if (this.isOpened.value) {
      this.isOpened.value = false;

      for (let node of this.childrens) {
        node.parentNode?.removeNode(node);
      }
    }
  }

  constructor(
    routes: Array<string | zzReactive<any>>,
    childrens: ViewNode[] = []
  ) {
    super({});

    this.isOpened = new zzBoolean(false);

    this.childrens = childrens;
    this.paramNames = [];

    let regexp = "^";
    for (let route of routes) {
      regexp += "/";
      if (typeof route === "string") {
        let result = route.matchAll(
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
        this.paramNames.push(route);
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

export class RouterView extends RouterComponent {
  constructor(childrens: ViewNode[] = []) {
    super({});

    this.append(childrens);

    this.onMount(() => {
      this.addToUnmount(
        AppRouter.onChangeRoute
          .addListener(() => {
            this.checkRoutes(AppRouter.path);
          })
          .run()
      );
    });
  }
}
