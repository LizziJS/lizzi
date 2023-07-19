/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  bigintValidator,
  booleanValidator,
  emailValidator,
  finiteValidator,
  integerValidator,
  lessNumberValidator,
  maxNumberValidator,
  maxStringLengthValidator,
  minNumberValidator,
  minStringLengthValidator,
  numberValidator,
  regexValidator,
  stepValidator,
  stringValidator,
} from "../Validators";
import { zzType } from "./type";

export class zzNumber<TNumber = number> extends zzType<TNumber> {
  max(max: number) {
    return this.addValidator(maxNumberValidator(max));
  }

  min(min: number) {
    return this.addValidator(minNumberValidator(min));
  }

  less(max: number) {
    return this.addValidator(lessNumberValidator(max));
  }

  more(min: number) {
    return this.addValidator(minNumberValidator(min));
  }

  finite() {
    return this.addValidator(finiteValidator);
  }

  step(step: number) {
    return this.addValidator(stepValidator(step));
  }

  integer() {
    return this.addValidator(integerValidator);
  }

  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(numberValidator);
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
    return this.addValidator(maxNumberValidator(max));
  }

  min(min: number) {
    return this.addValidator(minNumberValidator(min));
  }

  less(max: number) {
    return this.addValidator(lessNumberValidator(max));
  }

  more(min: number) {
    return this.addValidator(minNumberValidator(min));
  }

  step(step: number) {
    return this.addValidator(stepValidator(step));
  }

  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(bigintValidator);
  }
}

export class zzString<TString = string> extends zzType<TString> {
  constructor(value: TString = "" as any) {
    super(value);

    this.addValidator(stringValidator);
  }

  max(max: number) {
    return this.addValidator(maxStringLengthValidator(max));
  }

  min(min: number) {
    return this.addValidator(minStringLengthValidator(min));
  }

  length(length: number) {
    return this.addValidator(maxStringLengthValidator(length));
  }

  email() {
    return this.addValidator(emailValidator);
  }

  enum(...values: TString[]) {
    return this.addValidator((value) => values.includes(value));
  }

  regexValidator(regex: RegExp) {
    return this.addValidator(regexValidator(regex));
  }
}

export class zzBoolean extends zzType<boolean> {
  constructor(value: boolean = false) {
    super(value);

    this.addValidator(booleanValidator);
  }

  toggle() {
    this.value = !this.value;

    return this;
  }
}
