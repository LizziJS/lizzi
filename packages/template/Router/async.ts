/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewComponent } from "../view/ViewComponent";
import { ViewNode } from "../view/ViewNode";

export class ViewAsyncInstance extends ViewComponent {
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
