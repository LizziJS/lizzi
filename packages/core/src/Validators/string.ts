export const stringValidator = (value: any) => typeof value === "string";

export const maxStringLengthValidator = (max: number) => (value: any) =>
  value.length <= max;

export const minStringLengthValidator = (min: number) => (value: any) =>
  value.length >= min;

export const regexValidator = (regex: RegExp) => (value: any) =>
  regex.test(value);

export const emailValidator = regexValidator(
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
);

export const enumValidator =
  <T extends string>(values: T[]) =>
  (value: any): value is T =>
    values.includes(value);

export const notEmptyValidator = (value: any) => value !== "";
