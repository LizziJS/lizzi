/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ValueChangeEvent, zzReactive } from "../reactive";

export const runVar = <T>(target: zzReactive<T>) =>
  new ValueChangeEvent(target.value, target.value, target);
