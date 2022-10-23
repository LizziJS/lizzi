import { zzArray, zzInteger, zzReactive, zzString } from "@lizzi/core";

export class People {
  readonly name: zzString;
  readonly age: zzInteger;

  constructor(name: string, age: number) {
    this.name = new zzString(name);
    this.age = new zzInteger(age);
  }
}

export const names = new zzArray([
  new People("Stanislav", 19),
  new People("Anna", 23),
  new People("Jack", 35),
  new People("Simon", 66),
]);
