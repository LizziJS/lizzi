/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, zzS } from "@lizzi/core";
import { onClick } from "../DOM";
import { JSX } from "../jsx-runtime";
import { ViewComponent } from "../view";
import { Router } from "./view";

export class Link extends ViewComponent {
  constructor({ href, children }: { href: string; children: JSX.Childrens }) {
    super({});

    const link = zzMakeReactive(href);

    this.append(
      <a
        href={zzS`${link}`}
        use={[
          onClick(() => {
            this.findParent<Router<any>>((node) => node instanceof Router)?.go(
              link.value
            );
          }),
        ]}
      >
        {children}
      </a>
    );
  }
}
