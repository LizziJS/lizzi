/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { validator } from "../Validators";
import { zzType } from "./type";

export class zzNumber<TNumber = number> extends zzType<TNumber> {
  max(max: number) {
    return this.addValidator(validator.number.maxNumber(max));
  }

  min(min: number) {
    return this.addValidator(validator.number.minNumber(min));
  }

  less(max: number) {
    return this.addValidator(validator.number.lessNumber(max));
  }

  more(min: number) {
    return this.addValidator(validator.number.minNumber(min));
  }

  finite() {
    return this.addValidator(validator.number.finite);
  }

  step(step: number) {
    return this.addValidator(validator.number.step(step));
  }

  integer() {
    return this.addValidator(validator.number.integer);
  }

  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(validator.number.validator);
  }
}

export class zzInteger extends zzNumber {
  constructor(value: number = 0) {
    super(value);

    this.integer();
  }
}

export class zzFloat<TNumber = number> extends zzNumber<TNumber> {}

export class zzBigInt<TNumber = BigInt> extends zzType<TNumber> {
  max(max: number) {
    return this.addValidator(validator.number.maxNumber(max));
  }

  min(min: number) {
    return this.addValidator(validator.number.minNumber(min));
  }

  less(max: number) {
    return this.addValidator(validator.number.lessNumber(max));
  }

  more(min: number) {
    return this.addValidator(validator.number.minNumber(min));
  }

  step(step: number) {
    return this.addValidator(validator.number.step(step));
  }

  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(validator.number.bigint);
  }
}

export class zzString<TString = string> extends zzType<TString> {
  constructor(value: TString = "" as any) {
    super(value);

    this.addValidator(validator.string.validator);
  }

  max(max: number) {
    return this.addValidator(validator.string.maxStringLength(max));
  }

  min(min: number) {
    return this.addValidator(validator.string.minStringLength(min));
  }

  length(length: number) {
    return this.addValidator(validator.string.maxStringLength(length));
  }

  enum(...values: TString[]) {
    return this.addValidator((value) => values.includes(value));
  }

  required() {
    return this.addValidator(validator.string.notEmpty);
  }
}

export class zzBoolean extends zzType<boolean> {
  constructor(value: boolean = false) {
    super(value);

    this.addValidator(validator.boolean.validator);
  }

  toggle() {
    this.value = !this.value;

    return this;
  }
}
