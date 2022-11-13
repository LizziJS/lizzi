/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewComponent } from "@lizzi/template/view/ViewComponent";
import { ViewNode } from "@lizzi/template/view/ViewNode";

export class AsyncView extends ViewComponent {
  constructor(asyncFn: () => Promise<ViewNode>) {
    super();

    this.onMount(async () => {
      const children = await asyncFn();

      //if still mounted
      if (this._viewState === "mounted") {
        this.appendChild(children);

        this.onceUnmount(() => this.removeAllChilds());
      }
    });
  }
}
