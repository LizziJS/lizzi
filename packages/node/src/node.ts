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
  zzEvent,
  zzReactive,
  zzReadonlyArray,
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
export type UseNode<TNode extends zzNode> =
  | Array<<T extends TNode>(view: T) => void>
  | (<T extends TNode>(view: T) => void);

export class zzNode extends zzDestructor implements INode {
  static [isNodeConstructor] = true;

  static isNode(check: any) {
    return (
      check &&
      zzArray.isArray(check.childNodes) &&
      "parentNode" in check &&
      "nodeState" in check &&
      typeof check["_mount"] === "function" &&
      typeof check["_unmount"] === "function"
    );
  }

  protected readonly _nodeState = new zzReactive<ViewComponentStatuses>(
    "unmounted"
  );

  protected readonly _onMount = zz.Event<<T extends this>(view: T) => void>();
  protected readonly _unmountDestructor = zz.Destructor();

  protected _parentNode: zzNode | null = null;
  readonly childNodes: zzArray<zzNode>;

  constructor({
    use = [],
  }: {
    use?: UseNode<zzNode>;
  } = {}) {
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
        item._unmount();
        item._setParentNode(null);
      }
    );

    this._initNodeEvents(use);
  }

  protected callChildren<C>(children: C | (<T extends this>(node: T) => C)): C {
    //check children is function and call it
    return typeof children === "function"
      ? (children as Function)(this)
      : children;
  }

  protected _initNodeEvents(use: UseNode<this>) {
    if (!use) return;

    if (!Array.isArray(use)) {
      this.onMount(use);
    } else {
      for (let useFn of use) {
        this.onMount(useFn);
      }
    }
  }

  destroy(): void {
    this._unmount();
    this.parentNode?.remove(this);
  }

  _mount(): void {
    if (this._nodeState.value !== "unmounted") return;

    this._nodeState.value = "mounted";

    this._unmountDestructor.add(
      zzDestructorsObserver.catch(() => {
        this._onMount.emit(this);
      })
    );
  }

  _unmount(): void {
    if (this._nodeState.value !== "mounted") return;

    this._unmountDestructor.destroy();

    this._nodeState.value = "unmounted";
  }

  protected onMount(mountFunc: (view: this) => void) {
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
    this._unmount();

    this._parentNode = parent;
  }

  protected append(node: zzNode | zzNode[]) {
    if (Array.isArray(node)) {
      this.childNodes.add(node);
    } else {
      this.childNodes.add([node]);
    }
  }

  protected remove(node: zzNode | zzNode[]) {
    if (Array.isArray(node)) {
      this.childNodes.remove(node);
    } else {
      this.childNodes.remove([node]);
    }
  }

  *findParentNodes<T extends zzNode>(
    findFn: (view: T) => boolean
  ): Generator<T, void> {
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
  ): Generator<T, void> {
    for (let child of this.childNodes) {
      if (findFn(child as T)) {
        yield child as T;
      } else {
        yield* (child as zzNode).findChildNodes(findFn);
      }
    }
  }

  firstChild<T extends zzNode>(instance: abstract new (...any: any[]) => T) {
    return (
      this.findChildNodes<T>((node) => node instanceof instance).next().value ??
      null
    );
  }

  firstParent<T extends zzNode>(instance: abstract new (...any: any[]) => T) {
    return (
      this.findParentNodes<T>((node) => node instanceof instance).next()
        .value ?? null
    );
  }

  flatChildInstances<T extends zzNode>(
    instance: abstract new (...any: any[]) => T
  ) {
    type MapT = T | zzReadonlyArray<MapT>;

    const mapNodes = (node: zzNode): MapT => {
      if (node instanceof instance) {
        return node;
      }

      return node.childNodes.map(mapNodes);
    };

    return this.childNodes.map(mapNodes).flat() as zzReadonlyArray<T>;
  }

  __setProperty(name: string, value: any) {
    if (value === undefined) return;

    const valueObj = this[name as keyof this];

    if (valueObj === undefined) {
      this[name as keyof this] = value;
      return;
    }

    if (zzEvent.isEvent(valueObj)) {
      valueObj.addListener(value);
      return;
    }

    if (zzReactive.isReactive(valueObj)) {
      valueObj.value = value;
      return;
    }
  }

  protected initProps(attributes: { [key: string]: any }) {
    for (let name in attributes) {
      this.__setProperty(name, attributes[name]);
    }
  }
}
