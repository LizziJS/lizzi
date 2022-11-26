/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzEvent } from "../../Event";
import { zzCompute, zzComputeFn } from "../compute";
import { zzReactive } from "../Reactive";

export const zzS = (strings: TemplateStringsArray, ...values: any) => {
  const concatArrayString: any[] = [];

  for (let i = 0; i < strings.length - 1; i++) {
    concatArrayString.push(strings[i]);
    concatArrayString.push(values[i]);
  }
  concatArrayString.push(strings[strings.length - 1]);

  return zzCompute(() => concatArrayString.join(""));
};

export function zz(
  strings: TemplateStringsArray,
  ...values: any
): zzComputeFn<string>;
export function zz<T>(
  fn: (...args: any) => T,
  ...dependencies: (zzReactive<any> | zzEvent<any>)[]
): zzComputeFn<T>;
export function zz(firstArg: any, ...values: any): any {
  if (typeof firstArg === "function") return zzCompute(firstArg, ...values);
  return zzS(firstArg, ...values);
}
