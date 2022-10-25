/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzMakeReactive, ValueOrReactive } from ".";
import { zzCompute } from "../compute";

export const zzIsEqual = <T>(a: ValueOrReactive<T>, b: ValueOrReactive<T>) => {
  const ar = zzMakeReactive(a);
  const br = zzMakeReactive(b);

  return zzCompute(() => ar.value === br.value, ar, br);
};

export const zzEq = zzIsEqual;

export const zzIsNotEqual = <T>(
  a: ValueOrReactive<T>,
  b: ValueOrReactive<T>
) => {
  const ar = zzMakeReactive(a);
  const br = zzMakeReactive(b);

  return zzCompute(() => ar.value !== br.value, ar, br);
};

export const zzNEq = zzIsNotEqual;

export const zzNot = <T>(value: ValueOrReactive<T>) => {
  const vr = zzMakeReactive(value);

  return zzCompute(() => !vr.value, vr);
};

export const zzN = zzNot;

export const zzIf = <T, R>(
  cond: ValueOrReactive<T>,
  onTrue: ValueOrReactive<R>,
  onFalse: ValueOrReactive<R>
) => {
  const cr = zzMakeReactive(cond);
  const tr = zzMakeReactive(onTrue);
  const fr = zzMakeReactive(onFalse);

  return zzCompute(() => (Boolean(cr.value) ? tr.value : fr.value), cr, tr, fr);
};
