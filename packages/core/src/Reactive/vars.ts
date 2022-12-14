/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzType } from "./Reactive";

export class zzNumber<NumberType = number> extends zzType<NumberType> {
  static zzInstance = Symbol.for(this.name);

  checkType(value: NumberType) {
    return (
      typeof value === "number" &&
      !Number.isNaN(value) &&
      Number.isFinite(value)
    );
  }
}

export class zzInteger extends zzNumber {
  static zzInstance = Symbol.for(this.name);

  checkType(value: number) {
    return Number.isInteger(value);
  }

  constructor(value: number = 0) {
    super(value);
  }
}

export const zzInt = zzInteger;

export class zzFloat extends zzNumber {
  static zzInstance = Symbol.for(this.name);

  checkType(value: number) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  constructor(value: number = 0) {
    super(value);
  }
}

export class zzStringType<
  StringType extends string = any
> extends zzType<StringType> {
  static zzInstance = Symbol.for(this.name);

  checkType(value: StringType) {
    return typeof value === "string";
  }
}

export class zzString extends zzStringType<string> {
  static zzInstance = Symbol.for(this.name);

  constructor(value: string = "") {
    super(value);
  }
}

export const zzStr = zzString;

export class zzBoolean extends zzType<boolean> {
  static zzInstance = Symbol.for(this.name);

  checkType(value: boolean) {
    return typeof value === "boolean";
  }

  constructor(value: boolean = false) {
    super(value);
  }
}

export const zzBool = zzBoolean;
