/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, ValueOrReactive, zzReactive } from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { ViewComponent } from "./ViewComponent";
import { ViewNode } from "./ViewNode";

export class SetTitle extends ViewComponent {
  readonly onChangeTitle = new zzEvent<(title: string) => void>();
  readonly title: zzReactive<string>;
  protected parentTitle: SetTitle | null;

  getTitle(): string {
    if (this.parentTitle) {
      return this.parentTitle.getTitle() + this.title.value;
    }

    return this.title.value;
  }

  constructor(
    title: ValueOrReactive<string>,
    childrens: ViewNode[] = [],
    addToParent: boolean = false
  ) {
    super(childrens);

    this.title = zzMakeReactive(title);
    this.parentTitle = null;

    this.onMount(() => {
      this.addToUnmount(
        this.title.onChange.addListener(() => {
          this.onChangeTitle.emit(this.title.value);
        })
      );

      this.addToUnmount(
        this.onChangeTitle.addListener(() => {
          document.title = this.getTitle();
        })
      );

      if (addToParent) {
        this.parentTitle = this.findParent<SetTitle>(
          (node) => node instanceof SetTitle
        );

        if (this.parentTitle) {
          this.addToUnmount(
            this.parentTitle.onChangeTitle.addListener(() => {
              this.onChangeTitle.emit(this.title.value);
            })
          );
        }
      }

      document.title = this.getTitle();
    });
  }
}

export const views = {
  SetTitle: (
    title: string | zzReactive<string>,
    childrens: ViewNode[] = [],
    addToParent: boolean = false
  ) => new SetTitle(title, childrens, addToParent),
};
