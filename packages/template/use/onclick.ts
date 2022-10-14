import { onEvent } from "./onevent";

export const onClick = (
  fn: (event: MouseEvent) => any,
  options: boolean = false
) => onEvent("click", fn, options);
