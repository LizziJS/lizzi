export const numberValidator = (value: any) =>
  typeof value === "number" && !Number.isNaN(value);

export const integerValidator = (value: any) => Number.isInteger(value);

export const finiteValidator = (value: any) => Number.isFinite(value);

export const stepValidator = (step: number) => (value: any) =>
  value % step === 0;

export const maxNumberValidator = (max: number) => (value: any) => value <= max;
export const lessNumberValidator = (max: number) => (value: any) => value < max;

export const minNumberValidator = (min: number) => (value: any) => value >= min;
export const moreNumberValidator = (min: number) => (value: any) => value > min;

export const bigintValidator = (value: any) => typeof value === "bigint";
