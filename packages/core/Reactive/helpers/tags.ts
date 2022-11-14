/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzCompute } from "../compute";

export const zz = (strings: TemplateStringsArray, ...values: any) => {
  const concatArrayString: any[] = [];

  for (let i = 0; i < strings.length - 1; i++) {
    concatArrayString.push(strings[i]);
    concatArrayString.push(values[i]);
  }
  concatArrayString.push(strings[strings.length - 1]);

  return zzCompute(() => concatArrayString.join(""));
};
