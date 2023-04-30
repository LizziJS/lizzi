/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzType } from "./type";

export class zzNumber<TNumber = number> extends zzType<TNumber> {
  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(
      (value) =>
        typeof value === "number" &&
        !Number.isNaN(value) &&
        Number.isFinite(value)
    );
  }
}

export class zzInteger extends zzNumber {
  constructor(value: number = 0) {
    super(value);

    this.addValidator((value) => Number.isInteger(value));
  }
}

export class zzFloat<TNumber = number> extends zzType<TNumber> {
  constructor(value: TNumber = 0 as any) {
    super(value);

    this.addValidator(
      (value) => typeof value === "number" && !Number.isNaN(value)
    );
  }
}

export class zzString<TString = string> extends zzType<TString> {
  constructor(value: TString = "" as any) {
    super(value);

    this.addValidator((value) => typeof value === "string");
  }
}

export class zzBoolean extends zzType<boolean> {
  constructor(value: boolean = false) {
    super(value);

    this.addValidator((value) => typeof value === "boolean");
  }
}
