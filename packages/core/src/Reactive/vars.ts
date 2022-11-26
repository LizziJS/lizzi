/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzType } from "./Reactive";

export class zzNumber<NumberType = number> extends zzType<NumberType> {
  checkType(value: NumberType) {
    return (
      typeof value === "number" &&
      !Number.isNaN(value) &&
      Number.isFinite(value)
    );
  }
}

export class zzInteger extends zzNumber {
  checkType(value: number) {
    return Number.isInteger(value);
  }
}

export const zzInt = zzInteger;

export class zzFloat extends zzNumber {
  checkType(value: number) {
    return typeof value === "number" && !Number.isNaN(value);
  }
}

export class zzString<StringType = string> extends zzType<StringType> {
  checkType(value: StringType) {
    return typeof value === "string";
  }
}

export const zzStr = zzString;

export class zzBoolean extends zzType<boolean> {
  checkType(value: boolean) {
    return typeof value === "boolean";
  }
}

export const zzBool = zzBoolean;
