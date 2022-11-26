import { on } from "./onevent";

export const onClick = (
  fn: (event: MouseEvent) => any,
  options: boolean = false
) => on("click", fn, options);
