/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IReactiveEvent } from "../reactive";
import { DestructorsStack } from "../../Destructor";
import { zzEvent } from "../../Event";

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
