/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IReactive, IReactiveEvent, IReactiveValue } from "../reactive";
import { DestructorsStack } from "../../Destructor";
import { onStartListening, zzEvent } from "../../Event";

export function zzEffect(
  fn: (...args: any) => void,
  ...dependencies: (IReactiveEvent<any> | zzEvent<any>)[]
) {
  const destructor = new DestructorsStack();

  for (let varOrEvent of dependencies) {
    if (varOrEvent instanceof zzEvent) {
      destructor.add(varOrEvent.addListener(fn));
    } else if (varOrEvent.onChange instanceof zzEvent) {
      destructor.add(varOrEvent.onChange.addListener(fn));
    }
  }

  fn();

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
