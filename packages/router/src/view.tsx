/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IReadOnlyArray, zz, zzReactive } from "@lizzi/core";
import { If, zzNode } from "@lizzi/node";
import { zzUrlRouter } from ".";

export abstract class RouterComponent extends zzNode {
  readonly routes: IReadOnlyArray<Route>;
  protected subPath: string = "";

  checkSubRoutes() {
    if (this.subPath.length === 0) {
      return true;
    }

    let found = false;
    for (const route of this.routes) {
      if (!found && route.checkRoute(this.subPath)) {
        found = true;
        continue;
      }

      route.close();
    }

    return found;
  }

  constructor() {
    super();

    this.routes = this.getFlatChildInstances(
      this.childNodes,
      RouterComponent
    ).itemsListener(
      () => this.checkSubRoutes(),
      () => this.checkSubRoutes()
    );
  }
}

export class Route extends RouterComponent {
  protected readonly isOpened = zz.Boolean(false);
  readonly regexp: RegExp;
  readonly values: zzReactive<any>[] = [];
  protected subPath: string = "";

  checkRoute(path: string) {
    let match = path.match(this.regexp);

    if (match === null) {
      this.close();

      return false;
    }

    for (let k in this.values) {
      this.values[k].value = match[Number(k) * 1 + 1];
    }

    this.subPath = path.substring(match[0].length);

    this.open();
    if (this.checkSubRoutes()) {
      return true;
    }

    this.close();

    return false;
  }

  open() {
    this.isOpened.value = true;
  }

  close() {
    this.isOpened.value = false;
  }

  constructRouteRegexp(route: Array<string | zzReactive<any>>) {
    if (route.length === 0) {
      return /^\//mu;
    }

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
        this.values.push(oneRoute);
      }
    }

    return new RegExp(regexp, "mu");
  }

  constructor({
    route,
    children,
  }: {
    children: zzNode | zzNode[];
    route: Array<string | zzReactive<any>>;
  }) {
    super();

    this.regexp = this.constructRouteRegexp(route);

    this.append(<If condition={this.isOpened}>{children}</If>);
  }
}

export class Router extends RouterComponent {
  readonly url = new zzUrlRouter();

  constructor({ children }: { children: zzNode | zzNode[] }) {
    super();

    this.append(children);

    this.onMount(() => {
      this.url.onChange
        .addListener(() => {
          this.subPath = this.url.pathname;
          this.checkSubRoutes();
        })
        .run();
    });
  }
}
