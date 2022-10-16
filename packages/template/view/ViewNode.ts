/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { DestructorsStack, IDestructor } from "@lizzi/core/Destructor";
import { zzEvent } from "@lizzi/core/Event";
import { JSX } from "@lizzi/template/jsx-runtime";
import { zzArray, zzComputeFn, zzObject, zzReactive } from "@lizzi/core";

type ViewComponentStatuses = "unmounted" | "mounted" | "in-unmount-process";

export const isViewNodeConstructor = Symbol();

export interface ViewClass {
  mount(): void;
  unmount(): void;
}

export class ViewNode implements ViewClass {
  static [isViewNodeConstructor] = true;

  readonly _onMount = new zzEvent<(view: ViewNode) => void>();
  readonly _onUnmount = new zzEvent<(view: ViewNode) => void>();
  readonly afterMount = new zzEvent<(view: ViewNode) => void>();

  protected readonly eventRemoveStack = new DestructorsStack();

  parentNode: ViewNode | null = null;
  readonly childNodes: ViewNode[] = [];

  readonly rootNodes: Node[] = [];
  protected _viewState: ViewComponentStatuses = "unmounted";
  protected _elements: Node[] = [];

  protected _appendElement(view: ViewNode, beforeViewNode: ViewNode | null) {
    const nodes = view.getElements();
    const lastElement = this._elements[0];
    const before = beforeViewNode
      ? beforeViewNode.getFirstElement()
      : lastElement;
    for (let node of nodes) {
      lastElement.parentNode?.insertBefore(node, before);
    }
  }

  appendChild(view: ViewNode) {
    if (view.parentNode !== null) {
      view.parentNode.removeNode(view);
    }

    view.parentNode = this;
    this.childNodes.push(view);

    this._appendElement(view, null);

    if (this._viewState === "mounted") {
      view.mount();
    }

    return this;
  }

  append(childrens?: JSX.Childrens) {
    if (Array.isArray(childrens)) {
      const viewNodes = childrens.map(JSXChildrenToNodeMapper);

      for (let view of viewNodes) {
        if (view) {
          this.appendChild(view);
        }
      }
    } else if (childrens) {
      this.appendChild(JSXChildrenToNodeMapper(childrens));
    }

    return this;
  }

  insertBefore(view: ViewNode, beforeView: ViewNode) {
    if (view.parentNode !== null) {
      view.parentNode.removeNode(view);
    }

    if (!beforeView) {
      return this.appendChild(view);
    }

    const indexBefore = this.childNodes.indexOf(beforeView);
    if (indexBefore !== -1) {
      view.parentNode = this;

      this.childNodes.splice(indexBefore, 0, view);

      this._appendElement(view, beforeView);

      if (this._viewState === "mounted") {
        view.mount();
      }
    }

    return this;
  }

  protected _removeElement(view: ViewNode) {
    const nodes = view.getElements();
    for (let node of nodes) {
      node.parentNode?.removeChild(node);
    }
  }

  removeNode(view: ViewNode) {
    if (view.parentNode === this) {
      view.unmount();

      const indexElement = this.childNodes.indexOf(view);
      if (indexElement !== -1) {
        this.childNodes.splice(indexElement, 1);
        view.parentNode = null;

        this._removeElement(view);
      }
    }

    return this;
  }

  remove(viewNodes: ViewNode[]) {
    for (let view of viewNodes) {
      this.removeNode(view);
    }

    return this;
  }

  removeAllChilds() {
    const childs = this.childNodes.slice();
    for (let view of childs) {
      this.removeNode(view);
    }

    return this;
  }

  findParent<T extends ViewNode>(
    findFn: (view: ViewNode) => boolean
  ): T | null {
    for (let parent = this.parentNode; parent; parent = parent.parentNode) {
      if (findFn(parent)) {
        return parent as T;
      }
    }

    return null;
  }

  parentContext<T extends ViewNode>(findInstance: new () => T) {
    const parentView = this.findParent<T>(
      (view) => view instanceof findInstance
    );

    if (!parentView)
      throw new Error(
        "Class " +
          this.constructor.name +
          " should have parent Node " +
          findInstance.name
      );

    return parentView;
  }

  filterChilds<T extends ViewNode>(findFn: (view: ViewNode) => boolean): T[] {
    let results: T[] = [];

    for (let child of this.childNodes) {
      if (findFn(child)) {
        results.push(child as T);
      }

      results = results.concat(child.filterChilds(findFn));
    }

    return results;
  }

  getElements() {
    let elements: Node[] = [];

    for (let node of this.childNodes) {
      elements = elements.concat(node.getElements());
    }

    return elements.concat(this._elements);
  }

  getFirstElement(): Node {
    return this.childNodes.length > 0
      ? this.childNodes[0].getFirstElement()
      : this._elements[0];
  }

  protected setNodeElements(elements: Node[]) {
    this._elements = elements;
  }

  mount() {
    if (this._viewState === "in-unmount-process") {
      console.trace(this, "unmount in progress, you should wait finish it");
      return;
    }

    if (this._viewState === "unmounted") {
      this._onMount.emit(this);

      this._viewState = "mounted";

      for (let view of this.childNodes.slice()) {
        view.mount();
      }

      //afterChilds mount
      this.afterMount.emit(this);
    }
  }

  unmount() {
    if (this._viewState === "mounted") {
      this._viewState = "in-unmount-process";

      for (let view of this.childNodes.slice()) {
        view.unmount();
      }

      this._onUnmount.emit(this);

      this.eventRemoveStack.destroy();

      this._viewState = "unmounted";
    }
  }

  onMount(fn: (view: this) => void) {
    this._onMount.addListener(fn as any);

    return this;
  }

  onceUnmount(fn: (view: this) => void) {
    this._onUnmount.addListenerOnce(fn as any);

    return this;
  }

  addToUnmount(...eventListeners: IDestructor[]) {
    eventListeners.forEach((listener) => this.eventRemoveStack.add(listener));

    return this;
  }

  // init constructor helper
  init(fn: (view: this) => void) {
    fn.call(this, this);

    return this;
  }
}

export class TextView extends ViewNode {
  constructor({
    children,
  }: {
    children:
      | string
      | number
      | boolean
      | zzReactive<any>
      | Array<string | number | boolean | zzReactive<any>>;
  }) {
    super();

    const text = Array.isArray(children)
      ? (new zzArray(children).join("") as zzReactive<any>)
      : children;

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

export class ArrayView<T extends ViewNode> extends ViewNode {
  constructor({ children }: { children: zzArray<T> | T[] }) {
    super();

    this.setNodeElements([document.createTextNode("")]);

    if (children instanceof zzArray) {
      this.onMount(() => {
        const mapArray: T[] = [];

        for (let view of children) {
          this.appendChild(view);

          mapArray.push(view);
        }

        this.addToUnmount(
          children.onAdd.addListener((ev) => {
            this.insertBefore(ev.added, mapArray[ev.index]);

            mapArray.splice(ev.index, 0, ev.added);
          }),
          children.onRemove.addListener((ev) => {
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
      this.append(children);
    }
  }
}

export class ObjectView<T extends ViewNode> extends ViewNode {
  constructor({ children }: { children: zzReactive<T | null> | T }) {
    super();

    this.setNodeElements([document.createTextNode("")]);

    if (children instanceof zzReactive) {
      this.onMount(() => {
        this.addToUnmount(
          children.onChange.addListener((ev) => {
            if (ev.last) {
              this.removeNode(ev.last);
            }

            if (ev.value) {
              this.appendChild(ev.value);
            }
          })
        );

        if (children.value) {
          this.appendChild(children.value);
        }

        this.onceUnmount(async () => {
          if (children.value) {
            this.removeNode(children.value);
          }
        });
      });
    } else {
      this.appendChild(children);
    }
  }
}

export const JSXChildrenToNodeMapper = (children: JSX.Children): ViewNode => {
  if (children instanceof zzArray || Array.isArray(children)) {
    return new ArrayView({ children });
  }

  if (children instanceof zzObject) {
    return new ObjectView({ children });
  }

  if (
    typeof children === "boolean" ||
    typeof children === "string" ||
    typeof children === "number" ||
    children instanceof zzReactive
  ) {
    return new TextView({ children });
  }

  return children;
};

export const MapJSXChildrensToNodes = (
  childrens: JSX.Childrens
): ViewNode[] => {
  if (Array.isArray(childrens)) {
    return childrens.map(JSXChildrenToNodeMapper).filter((view) => view);
  }

  return [JSXChildrenToNodeMapper(childrens)].filter((view) => view);
};
