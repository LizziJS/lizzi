/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "@lizzi/core/Event";
import { zzReactive } from "@lizzi/core/index";
import { ViewComponent } from "../view/ViewComponent";
import { ViewNode } from "../view/ViewNode";

export class If extends ViewComponent {
  constructor({
    condition,
    children,
  }: {
    condition: zzReactive<any> | any;
    children: ViewNode[];
  }) {
    super({ children });

    const afterChange = new zzEvent<() => void>();
    const elseNodes = children.filter((node) => node instanceof Else);
    const condNodes = children.filter((node) => !(node instanceof Else));

    if (condition instanceof zzReactive) {
      this.onMount((view) => {
        let last: boolean | null = null;
        let changing: boolean = false;

        const onChange = () => {
          if (changing) {
            return afterChange.addListenerOnce(onChange);
          }

          const visible = Boolean(condition.value);

          if (last !== visible) {
            changing = true;

            if (visible) {
              this.remove(elseNodes);
              this.append(condNodes);
            } else {
              this.remove(condNodes);
              this.append(elseNodes);
            }

            last = visible;

            changing = false;
            afterChange.emit();
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
