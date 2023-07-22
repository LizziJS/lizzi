export const stringValidator = {
  validator: (value: any) => typeof value === "string",

  maxStringLength: (max: number) => (value: any) => value.length <= max,

  minStringLength: (min: number) => (value: any) => value.length >= min,

  enum:
    <T extends string>(values: T[]) =>
    (value: any): value is T =>
      values.includes(value),

  notEmpty: (value: any) => value !== "",
};
