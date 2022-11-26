/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

export interface ISnapshotType<T> {
  readonly prototype: object;
  setter(object: { [key: string]: any }, values: T, isCreated: boolean): void;
  getter(object: { [key: string]: any }): void;
  primaries(): string[];
}

export interface ISnapshotValue {
  readonly prototype: object;
  readonly name: string;
  check(value: any): void;
}
