/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray, zzObject, zzReactive } from "@lizzi/core/index";
import { ViewNode } from "./ViewNode";

export class TextView extends ViewNode {
  constructor(text: number | string | boolean | zzReactive<any>) {
    super();

    if (text instanceof zzReactive) {
      const textElement = document.createTextNode("");
      this.setNodeElements([textElement]);

      this.onMount(() => {
        this.addToUnmount(
          text.onChange
            .addListener(() => {
              textElement.data = text.value;
            })
            .run()
        );
      });
    } else {
      this.setNodeElements([document.createTextNode(String(text))]);
    }
  }
}

export class TextHtmlView extends ViewNode {
  constructor(text: number | string | zzReactive<any>) {
    super();

    if (text instanceof zzReactive) {
      const htmlElement = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "zz-html"
      );
      this.setNodeElements([htmlElement]);

      this.onMount(() => {
        this.addToUnmount(
          text.onChange
            .addListener(() => {
              htmlElement.innerHTML = text.value;
            })
            .run()
        );
      });
    } else {
      const htmlElement = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "zz-html"
      );
      htmlElement.innerHTML = String(text);
      this.setNodeElements([htmlElement]);
    }
  }
}

export class ArrayView<T extends ViewNode> extends ViewNode {
  constructor(viewsList: zzArray<T> | T[]) {
    super();

    this.setNodeElements([document.createTextNode("")]);

    if (viewsList instanceof zzArray) {
      this.onMount(() => {
        const mapArray: T[] = [];

        for (let view of viewsList) {
          this.appendChild(view);

          mapArray.push(view);
        }

        this.addToUnmount(
          viewsList.onAdd.addListener((ev) => {
            this.insertBefore(ev.added, mapArray[ev.index]);

            mapArray.splice(ev.index, 0, ev.added);
          }),
          viewsList.onRemove.addListener((ev) => {
            this.removeNode(ev.removed);

            mapArray.splice(ev.index, 1);
          })
        );

        this.onceUnmount(() => {
          for (let view of mapArray) {
            this.removeNode(view);
          }
        });
      });
    } else {
      this.append(viewsList);
    }
  }
}

export class ObjectView<T extends ViewNode> extends ViewNode {
  constructor(viewObject: zzObject<T> | T) {
    super();

    this.setNodeElements([document.createTextNode("")]);

    if (viewObject instanceof zzReactive) {
      this.onMount(() => {
        this.addToUnmount(
          viewObject.onChange.addListener(async (ev) => {
            if (ev.last) {
              this.removeNode(ev.last);
            }

            if (ev.value) {
              this.appendChild(ev.value);
            }
          })
        );

        if (viewObject.value) {
          this.appendChild(viewObject.value);
        }

        this.onceUnmount(async () => {
          if (viewObject.value) {
            this.removeNode(viewObject.value);
          }
        });
      });
    } else {
      this.appendChild(viewObject);
    }
  }
}

export const reactiveViews = {
  Text: (
    value:
      | Array<number | string | zzReactive<any>>
      | boolean
      | number
      | string
      | zzReactive<any>
  ) => {
    if (Array.isArray(value)) {
      return new TextView(new zzArray(value).join());
    }
    return new TextView(value);
  },
  Html: (
    value:
      | Array<number | string | zzReactive<any>>
      | number
      | string
      | zzReactive<any>
  ) => {
    if (Array.isArray(value)) {
      return new TextHtmlView(new zzArray(value).join());
    }
    return new TextHtmlView(value);
  },
  Array: <T extends ViewNode>(value: zzArray<T> | T[]) => new ArrayView(value),
  Object: <T extends ViewNode>(value: zzObject<T> | T) => new ObjectView(value),
};
