/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, zzRoV } from "@lizzi/core";
import { onClick, ViewComponent } from "@lizzi/template";
import { JSX } from "@lizzi/template/jsx-runtime";
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
