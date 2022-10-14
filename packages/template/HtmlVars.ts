/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzCompute, zzReactive } from "@lizzi/core";

export function vNot(value: zzReactive<any>) {
  return zzCompute<boolean>(() => !value.value, value);
}

export function vIf<T>(value: zzReactive<any>, trueValue: T, falseValue: T) {
  return zzCompute<T>(() => (value.value ? trueValue : falseValue), value);
}
