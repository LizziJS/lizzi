/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, zz, zzRoV } from "@lizzi/core";
import { onClick } from "../DOM";
import { JSX } from "../jsx-runtime";
import { ViewComponent } from "../view";
import { Router } from "./view";

export class Link extends ViewComponent {
  constructor({
    href,
    children,
    ...args
  }: {
    href: zzRoV<string>;
    children: JSX.Childrens;
    [key: string]: any;
  }) {
    super({});

    const link = zzMakeReactive(href);

    this.append(
      <a
        href={link}
        {...args}
        use={[
          ...(args.use ?? []),
          onClick((ev) => {
            const router = this.findParent<Router<any>>(
              (node) => node instanceof Router
            );

            if (router) {
              ev.preventDefault();
              router.go(link.value);
            }
          }),
        ]}
      >
        {children}
      </a>
    );
  }
}
