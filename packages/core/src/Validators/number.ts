export const numberValidator = {
  validator: (value: any) => typeof value === "number" && !Number.isNaN(value),

  integer: (value: any) => Number.isInteger(value),

  finite: (value: any) => Number.isFinite(value),

  step: (step: number) => (value: any) => value % step === 0,

  maxNumber: (max: number) => (value: any) => value <= max,
  lessNumber: (max: number) => (value: any) => value < max,

  minNumber: (min: number) => (value: any) => value >= min,
  moreNumber: (min: number) => (value: any) => value > min,

  bigint: (value: any) => typeof value === "bigint",
};
