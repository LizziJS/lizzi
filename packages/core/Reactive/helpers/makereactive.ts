/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzReactive } from "../reactive";

export type ValueOrReactive<T> = T | zzReactive<T>;

export function zzMakeReactive<T>(value: ValueOrReactive<T>) {
  return value instanceof zzReactive ? value : new zzReactive<T>(value);
}

export const zzR = zzMakeReactive;
