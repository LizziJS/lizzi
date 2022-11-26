/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IDestructor, DestructorsStack } from "../Destructor";
import { zzEvent } from "./events";

export class EventsObserver implements IDestructor {
  protected readonly destructionStack = new DestructorsStack();

  destroy() {
    this._isWatching = false;
    this._onStopWatching.emit(this._isWatching);

    this.destructionStack.destroy();
  }

  protected readonly _onStartWatching = new zzEvent<
    (isWatching: boolean) => void
  >();
  protected readonly _onStopWatching = new zzEvent<
    (isWatching: boolean) => void
  >();
  protected events: zzEvent<(...args: any[]) => void>[];
  protected _isWatching: boolean;

  get isWatching() {
    return this._isWatching;
  }

  onChangeListenersCount() {
    const count = this.events.reduce(
      (acc, event) => acc + event.countListeners(),
      0
    );

    if (count > 0 && this._isWatching === false) {
      this._isWatching = true;

      this._onStartWatching.emit(this._isWatching);
    } else if (count === 0 && this._isWatching === true) {
      this._isWatching = false;

      this._onStopWatching.emit(this._isWatching);
    }
  }

  onStartWatching(fn: (isWatching: boolean) => void) {
    return this._onStartWatching.addListener(fn);
  }

  onStopWatching(fn: (isWatching: boolean) => void) {
    return this._onStopWatching.addListener(fn);
  }

  constructor(...events: zzEvent<(...args: any[]) => void>[]) {
    this.events = events;
    this._isWatching = false;

    for (const event of events) {
      this.destructionStack.add(
        event.onAddListener.addListener(() => this.onChangeListenersCount()),
        event.onRemoveListener.addListener(() => this.onChangeListenersCount())
      );
    }

    this.onChangeListenersCount();
  }
}

export function onStartListening(
  fn: () => IDestructor,
  ...events: zzEvent<(...args: any[]) => void>[]
) {
  const eventsStack = new DestructorsStack();
  const eventObserver = new EventsObserver(...events);

  eventObserver.onStartWatching(() => {
    eventsStack.add(fn());
  });

  eventObserver.onStopWatching(() => {
    eventsStack.destroy();
  });

  return eventObserver;
}
