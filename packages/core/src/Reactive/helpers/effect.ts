/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  IReactive,
  IReactiveEvent,
  IReactiveValue,
  zzReactive,
  zzReactiveGetObserver,
} from "../Reactive";
import { DestructorsStack } from "../../Destructor";
import { onStartListening, zzEvent } from "../../Event";

export function createEffect(
  fn: (...args: any) => void,
  ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
) {
  const variableStack = new DestructorsStack();
  const destructor = new DestructorsStack(variableStack);

  const checkChange = () => {
    variableStack.destroy();

    zzReactiveGetObserver.runIsolated((variable) => {
      variableStack.add(variable.onChange.addListener(checkChange));
    }, fn);
  };

  for (let varOrEvent of dependencies) {
    if (varOrEvent instanceof zzEvent) {
      destructor.add(varOrEvent.addListener(checkChange));
    } else if (varOrEvent.onChange instanceof zzEvent) {
      destructor.add(varOrEvent.onChange.addListener(checkChange));
    }
  }

  checkChange();

  return destructor;
}

export function zzEventDepends(
  ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
) {
  const event = new zzEvent<(...args: any) => void>();

  EventAffect(event, ...dependencies);

  return event;
}

export function ValueAffect<T>(source: IReactive<T>, value: IReactiveValue<T>) {
  return source.onChange.addListener(() => {
    value.value = source.value;
  });
}

export function EventAffect<T>(
  event: zzEvent<any>,
  ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
) {
  const fn = (...args: any) => {
    event.emit(...args);
  };

  return onStartListening(() => {
    const destructor = new DestructorsStack();

    for (let varOrEvent of dependencies) {
      if (varOrEvent instanceof zzEvent) {
        destructor.add(varOrEvent.addListener(fn));
      } else if (varOrEvent.onChange instanceof zzEvent) {
        destructor.add(varOrEvent.onChange.addListener(fn));
      }
    }

    return destructor;
  }, event);
}

export class zzValueFilter<Out, In> extends zzReactive<Out> {
  static zzInstance = Symbol.for(this.name);

  onChange;

  protected readonly onChangeFn: (newValue: In) => Out | undefined;
  protected readonly source: zzReactive<Out>;

  get value(): Out {
    return this.source.value;
  }

  set value(newValue: any) {
    const changedValue = this.onChangeFn(newValue);
    if (changedValue !== undefined) {
      this.source.value = changedValue;
    }
  }

  constructor(
    source: zzReactive<Out>,
    onChange: (newValue: In) => Out | undefined
  ) {
    super(null as any);

    this.source = source;
    this.onChange = source.onChange;

    this.onChangeFn = onChange;
  }
}
