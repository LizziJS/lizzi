/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

export function Debounce(fn: () => void, time = 0): () => void {
  let timer = true;

  let timeoutFnCall = () => {
    timer = true;

    fn.call(null);
  };

  return function () {
    if (timer) {
      timer = false;
      setTimeout(timeoutFnCall, time);
    }
  };
}
