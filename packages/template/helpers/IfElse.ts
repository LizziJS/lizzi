/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "@lizzi/core/index";
import { JSX } from "@lizzi/template/jsx-runtime";
import { MapJSXChildrensToNodes } from "../view";
import { ViewComponent } from "../view/ViewComponent";

export class If extends ViewComponent {
  constructor({
    condition,
    children,
  }: {
    condition: zzReactive<any> | any;
    children: JSX.Childrens;
  }) {
    super();

    const nodes = MapJSXChildrensToNodes(children);

    const elseNodes = nodes.filter((node) => node instanceof Else);
    const condNodes = nodes.filter((node) => !(node instanceof Else));

    if (condition instanceof zzReactive) {
      this.onMount((view) => {
        let last: boolean | null = null;

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

        view.onceUnmount(() => {
          this.removeAllChilds();
        });
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
