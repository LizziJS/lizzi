import { on } from "./onevent";

export const onClick = (
  fn: (event: MouseEvent) => void,
  options: boolean = false
) => on("click", fn as any, options);
