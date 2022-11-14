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

/*
export const zzF = <T>(strings: TemplateStringsArray, ...values: any) => {
  const concat: any[] = [];

  for (let i = 0; i < strings.length - 1; i++) {
    concat.push(strings[i]);
    concat.push(`arg[${i}]`);
  }
  concat.push(strings[strings.length - 1]);

  const computeFn = new Function("arg", `return (${concat.join(" ")})`);

  const refreshEvent = new zzEvent<() => void>();
  const joinedFn = zzCompute<T>(
    () =>
      computeFn(
        values.map((value: any) =>
          value instanceof zzReactive ? value.value : value
        )
      ),
    refreshEvent
  );

  onStartListening(() => {
    const destructor = new DestructorsStack();

    for (const value of values) {
      if (value instanceof zzReactive) {
        destructor.add(value.onChange.addListener(() => refreshEvent.emit()));
      }
    }

    return destructor;
  }, joinedFn.onChange);

  return joinedFn;
};
*/
