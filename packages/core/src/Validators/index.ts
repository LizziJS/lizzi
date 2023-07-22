import { booleanValidator } from "./boolean";
import { numberValidator } from "./number";
import { stringValidator } from "./string";

export const validator = {
  boolean: booleanValidator,
  number: numberValidator,
  string: stringValidator,
};
