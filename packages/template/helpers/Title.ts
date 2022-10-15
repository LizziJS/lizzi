/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, ValueOrReactive, zzReactive } from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { JSX } from "@lizzi/template/jsx-runtime";
import { ViewComponent } from "../view/ViewComponent";

export class Title extends ViewComponent {
  readonly onChangeTitle = new zzEvent<(title: string) => void>();
  readonly title: zzReactive<string>;
  protected parentTitle: Title | null = null;

  setTitle() {
    document.title = this.title.value;
  }

  constructor({
    title,
    children,
  }: {
    title: ValueOrReactive<string>;
    children: JSX.Childrens;
  }) {
    super({ children });

    this.title = zzMakeReactive(title);

    this.onMount(() => {
      this.parentTitle = this.findParent((view) => view instanceof Title);

      this.addToUnmount(
        this.title.onChange
          .addListener(() => {
            this.setTitle();
          })
          .run()
      );

      this.onceUnmount(() => {
        if (this.parentTitle) {
          this.parentTitle.setTitle();
        }
      });
    });
  }
}
