/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzCompute, zzReactive } from "@lizzi/core";
import { zzNode } from "./node";

type Props = {
  condition: zzReactive<any> | (() => boolean) | any;
  children: zzNode | zzNode[];
};

export class If extends zzNode<Props> {
  onMount({ condition, children }: Props) {
    const nodes = Array.isArray(children) ? children : [children];

    const elseNodes = nodes.filter((node) => node instanceof Else);
    const condNodes = nodes.filter((node) => !(node instanceof Else));

    if (typeof condition === "function") {
      condition = zzCompute(condition);
    }

    if (zzReactive.isReactive(condition)) {
      let last: boolean | null = null;

      this.addToMount(() => {
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

        condition.onChange.addListener(onChange).run();
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

type ElseProps = { children: zzNode | zzNode[] };

export class Else extends zzNode<ElseProps> {
  onMount({ children }: ElseProps) {
    this.append(children);
  }
}
