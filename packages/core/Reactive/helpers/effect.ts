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
} from "../reactive";
import { DestructorsStack } from "../../Destructor";
import { onStartListening, zzEvent } from "../../Event";

export function zzObserver(
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

export function zzEventsAffect(
  ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
) {
  const event = new zzEvent<(...args: any) => void>();

  const fn = (...args: any) => {
    event.emit(...args);
  };

  onStartListening(() => {
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

  return event;
}

export function zzValueAffect<T>(
  source: IReactive<T>,
  value: IReactiveValue<T>
) {
  return source.onChange.addListener(() => {
    value.value = source.value;
  });
}

export class zzValueFilter<Out, In> extends zzReactive<Out> {
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
