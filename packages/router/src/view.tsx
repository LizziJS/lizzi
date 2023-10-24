/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zz, zzReactive, zzReadonlyArray } from "@lizzi/core";
import { If, zzNode } from "@lizzi/node";
import { UrlArray, zzRouter, zzUrlRouter } from ".";
import { RouteAnchor, RouteAnchorName } from "./anchor";

export abstract class RouterComponent extends zzNode {
  readonly routes: zzReadonlyArray<Route>;
  protected subPath: string = "";
  protected prePath: string = "";
  route: Array<string | zzReactive<any>>;

  checkSubRoutes() {
    if (this.subPath.length === 0) {
      for (const route of this.routes) {
        route.close();
      }

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

  go(url: UrlArray) {
    zzRouter(this).go([this.prePath, ...url]);
  }

  constructor() {
    super({});

    this.route = ["root"];

    this.routes = this.flatChildInstances(
      RouterComponent
    ) as any as zzReadonlyArray<Route>;
    this.routes.onChange.addListener(() => this.checkSubRoutes());
  }
}

export class Route extends RouterComponent {
  protected readonly isOpened = zz.Boolean(false);
  readonly regexp: RegExp;
  readonly values: zzReactive<any>[] = [];

  static Anchor = RouteAnchor;

  checkRoute(path: string) {
    let match = path.match(this.regexp);

    if (match === null) {
      this.close();

      return false;
    }

    for (let k in this.values) {
      this.values[k].value = match[Number(k) * 1 + 1];
    }

    this.prePath = match[0];
    this.subPath = path.substring(this.prePath.length);

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
    children: zzNode<any> | zzNode<any>[];
    route: Array<string | zzReactive<any>>;
  }) {
    super();

    this.regexp = this.constructRouteRegexp(route);
    this.route = route;

    this.append(<If condition={this.isOpened}>{children}</If>);
  }
}

export class Router extends RouterComponent {
  readonly url = new zzUrlRouter();

  findAnchor(name: RouteAnchorName) {
    return (
      this.findChildNodes<RouteAnchor>(
        (node) => node instanceof RouteAnchor && node.isAnchorName(name)
      ).next().value ?? null
    );
  }

  constructor({
    children,
  }: {
    children: zzNode | zzNode[] | (<T extends zzNode>(node: T) => zzNode);
  }) {
    super();

    children = this.callChildren(children);

    this.append(children);

    this.addToMount(() => {
      this.url.onChange
        .addListener(() => {
          this.subPath = this.url.pathname;
          this.checkSubRoutes();
        })
        .run();
    });
  }
}
