/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

export interface IDestructor {
  destroy(): void;
}

export class DestructorsStack implements IDestructor {
  readonly destructors = new Set<IDestructor>();

  destroy() {
    for (const destructor of this.destructors) {
      destructor.destroy();
    }
    this.destructors.clear();

    return this;
  }

  add(...destructors: IDestructor[]) {
    for (const destructor of destructors) {
      this.destructors.add(destructor);
    }

    return this;
  }

  addFn(...fn: (() => void)[]) {
    this.add(...fn.map(DestructorFn));
  }

  constructor(...destructors: IDestructor[]) {
    this.add(...destructors);
  }
}

export function DestructorFn(destroy: () => void): IDestructor {
  return { destroy };
}

export class zzEventListener<ListenerFuncT extends (...args: any[]) => void>
  implements IDestructor
{
  readonly target: zzSimpleEvent<ListenerFuncT>;
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
    target: zzSimpleEvent<any>,
    fn: ListenerFuncT,
    runOnce: boolean = false
  ) {
    this.target = target;
    this.fn = fn;
    this.willRunOnce = runOnce;
  }
}

export class zzSimpleEvent<ListenerFuncT extends (...args: any[]) => void> {
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
    const values = Array.from(this.listenersMap.values());

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
> extends zzSimpleEvent<ListenerFuncT> {
  readonly onAddListener = new zzSimpleEvent<
    (listener: zzEventListener<ListenerFuncT>) => void
  >();
  readonly onRemoveListener = new zzSimpleEvent<
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
