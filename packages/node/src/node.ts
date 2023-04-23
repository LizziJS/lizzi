/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  zz,
  zzArray,
  zzDestructor,
  zzDestructorsObserver,
  zzReactive,
} from "@lizzi/core";

type ViewComponentStatuses = "unmounted" | "mounted";

export interface INode {
  nodeState: ViewComponentStatuses;
  childNodes: zzArray<zzNode>;
  parentNode: zzNode | null;

  _mount(): void;
  _unmount(): void;
}

export const isNodeConstructor = Symbol("isNodeConstructor");

export class zzNode extends zzDestructor implements INode {
  static [isNodeConstructor] = true;

  protected readonly _nodeState = new zzReactive<ViewComponentStatuses>(
    "unmounted"
  );

  readonly _onMount = zz.event<<T extends this>(view: T) => void>();
  readonly _unmountDestructor = zz.destructor();

  protected _parentNode: zzNode | null = null;
  readonly childNodes: zzArray<zzNode>;

  constructor() {
    super();

    this.childNodes = new zzArray<zzNode>().itemsListener(
      (item) => {
        item._setParentNode(this);

        this._nodeState.onChange
          .addListener(() => {
            if (this._nodeState.value === "mounted") {
              item._mount();
            } else if (this._nodeState.value === "unmounted") {
              item._unmount();
            }
          })
          .run();
      },
      (item) => {
        item._setParentNode(null);
      }
    );
  }

  destroy(): void {
    this._unmount();
    this.parentNode?.remove(this);
  }

  _mount(): void {
    if (this._nodeState.value !== "unmounted") return;

    this._unmountDestructor.add(
      zzDestructorsObserver.catch(() => {
        this._onMount.emit(this);
      })
    );

    this._nodeState.value = "mounted";
  }

  _unmount(): void {
    if (this._nodeState.value !== "mounted") return;

    this._unmountDestructor.destroy();

    this._nodeState.value = "unmounted";
  }

  onMount(mountFunc: (view: this) => void) {
    this._onMount.addListener(mountFunc);
  }

  onceUnmount(unmountFunc: () => void) {
    this._unmountDestructor.addFunc(unmountFunc);
  }

  get nodeState() {
    return this._nodeState.value;
  }

  get parentNode() {
    return this._parentNode;
  }

  _setParentNode(parent: zzNode | null) {
    if (this._parentNode !== null) {
      this._parentNode.childNodes.remove([this]);
    }

    this._parentNode = parent;
  }

  append(node: zzNode | zzNode[]) {
    if (Array.isArray(node)) {
      this.childNodes.add(node);
    } else {
      this.childNodes.add([node]);
    }
  }

  remove(node: zzNode | zzNode[]) {
    if (Array.isArray(node)) {
      this.childNodes.remove(node);
    } else {
      this.childNodes.remove([node]);
    }
  }

  *findParentNodes<T extends zzNode>(
    findFn: (view: T) => boolean
  ): Generator<T> {
    for (
      let parent = this.parentNode;
      parent !== null;
      parent = parent.parentNode
    ) {
      if (findFn(parent as T)) {
        yield parent as T;
      }
    }
  }

  *findChildNodes<T extends zzNode>(
    findFn: (view: zzNode) => boolean
  ): Generator<T> {
    for (let child of this.childNodes) {
      if (findFn(child as T)) {
        yield child as T;
      } else {
        yield* (child as zzNode).findChildNodes(findFn);
      }
    }
  }
}
