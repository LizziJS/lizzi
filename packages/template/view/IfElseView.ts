/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "@lizzi/core/Event";
import { zzReactive } from "@lizzi/core/index";
import { ViewComponent } from "./ViewComponent";
import { ViewNode } from "./ViewNode";

export class If extends ViewComponent {
  constructor(
    condition: zzReactive<any> | any,
    condNodes: ViewNode[] = [],
    elseNodes: ViewNode[] = []
  ) {
    super();

    const afterChange = new zzEvent<() => void>();

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

export const views = {
  If: (
    condition: zzReactive<any> | any,
    condNodes: ViewNode[] = [],
    elseNodes: ViewNode[] = []
  ) => new If(condition, condNodes, elseNodes),
};
