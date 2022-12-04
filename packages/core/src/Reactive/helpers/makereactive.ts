/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "../Reactive";

export type ValueOrReactive<T> = T | zzReactive<T>;
export type zzRV<T> = ValueOrReactive<T>; // shortcut

export function zzMakeReactive<T>(value: ValueOrReactive<T>) {
  return value instanceof zzReactive ? value : new zzReactive<T>(value);
}

export function toValue<T>(value: ValueOrReactive<T>): T {
  return value instanceof zzReactive ? value.value : value;
}
