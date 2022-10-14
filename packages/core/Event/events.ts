/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

export interface IDestructor {
  destroy(): void;
}

export class DestructorsStack implements IDestructor {
  readonly onDestroy = new zzEvent<(element: IDestructor) => void>();

  destroy() {
    this.onDestroy.emit(this);
    this.onDestroy.removeAllListeners();

    return this;
  }

  add(...destructors: IDestructor[]) {
    for (const destructor of destructors) {
      this.onDestroy.addListener(() => destructor.destroy());
    }

    return this;
  }

  addFunc(fn: () => void) {
    this.onDestroy.addListener(fn);
  }

  constructor(...destructors: IDestructor[]) {
    this.add(...destructors);
  }
}

export class zzEventListener<ListenerFuncT extends (...args: any[]) => void>
  implements IDestructor
{
  readonly target: _Event<ListenerFuncT>;
  readonly fn: ListenerFuncT;
  readonly willRunOnce: boolean;

  run(...args: Parameters<ListenerFuncT>) {
    if (this.willRunOnce) {
      this.remove();
    }

    this.fn.call(this.target, ...args);

    return this;
  }

  remove() {
    this.destroy();
  }

  destroy() {
    this.target.removeListener(this.fn);

    return this;
  }

  constructor(
    target: _Event<any>,
    fn: ListenerFuncT,
    runOnce: boolean = false
  ) {
    this.target = target;
    this.fn = fn;
    this.willRunOnce = runOnce;
  }
}

export class _Event<ListenerFuncT extends (...args: any[]) => void> {
  protected readonly listenersMap = new Map<
    ListenerFuncT,
    zzEventListener<ListenerFuncT>
  >();

  addListener<FuncT extends ListenerFuncT>(fn: FuncT): zzEventListener<FuncT> {
    const newEventListener = new zzEventListener<FuncT>(this, fn);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  addListenerOnce<FuncT extends ListenerFuncT>(
    fn: FuncT
  ): zzEventListener<FuncT> {
    const newEventListener = new zzEventListener<FuncT>(this, fn, true);

    this.listenersMap.set(fn, newEventListener);

    return newEventListener;
  }

  removeListener(fn: ListenerFuncT) {
    this.listenersMap.delete(fn);
  }

  removeAllListeners() {
    this.listenersMap.clear();
  }

  emit(...args: Parameters<ListenerFuncT>) {
    const values = this.listenersMap.values();

    for (let listener of values) {
      listener.run(...args);
    }
  }

  countListeners(): number {
    return this.listenersMap.size;
  }
}

export class zzEvent<
  ListenerFuncT extends (...args: any[]) => void
> extends _Event<ListenerFuncT> {
  readonly onAddListener = new _Event<
    (listener: zzEventListener<ListenerFuncT>) => void
  >();
  readonly onRemoveListener = new _Event<
    (listener: zzEventListener<ListenerFuncT>) => void
  >();

  addListener<FuncT extends ListenerFuncT>(fn: FuncT): zzEventListener<FuncT> {
    const newEventListener = super.addListener<FuncT>(fn);

    this.onAddListener.emit(newEventListener);

    return newEventListener;
  }

  addListenerOnce<FuncT extends ListenerFuncT>(
    fn: FuncT
  ): zzEventListener<FuncT> {
    const newEventListener = super.addListenerOnce<FuncT>(fn);

    this.onAddListener.emit(newEventListener);

    return newEventListener;
  }

  removeListener(fn: ListenerFuncT) {
    const listenerWillRemove = this.listenersMap.get(fn);

    if (listenerWillRemove !== undefined) {
      super.removeListener(fn);

      this.onRemoveListener.emit(listenerWillRemove);
    }
  }

  removeAllListeners() {
    const listenersList = this.listenersMap.values();

    super.removeAllListeners();

    Array.from(listenersList).forEach((listenerWillRemove) => {
      this.onRemoveListener.emit(listenerWillRemove);
    });
  }
}
