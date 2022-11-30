/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzCompute, zzReactive } from "@lizzi/core";
import { JSX } from "@lizzi/jsx-runtime";
import { MapJSXChildrensToNodes } from "../view";
import { ViewComponent } from "../view/ViewComponent";

export class If extends ViewComponent {
  constructor({
    condition,
    children,
  }: {
    condition: zzReactive<any> | (() => boolean) | any;
    children: JSX.Childrens;
  }) {
    super();

    const nodes = MapJSXChildrensToNodes(children);

    const elseNodes = nodes.filter((node) => node instanceof Else);
    const condNodes = nodes.filter((node) => !(node instanceof Else));

    if (typeof condition === "function") {
      condition = zzCompute(condition);
    }

    if (condition instanceof zzReactive) {
      let last: boolean | null = null;

      this.onMount((view) => {
        const onChange = () => {
          const visible = Boolean(condition.value);

          if (last !== visible) {
            if (visible) {
              this.remove(elseNodes);
              this.append(condNodes);
            } else {
              this.remove(condNodes);
              this.append(elseNodes);
            }

            last = visible;
          }
        };

        view.addToUnmount(condition.onChange.addListener(onChange).run());
      });
    } else {
      if (condition) {
        this.append(condNodes);
      } else {
        this.append(elseNodes);
      }
    }
  }
}

export class Else extends ViewComponent {}
