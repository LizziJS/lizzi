import { DestructorsStack } from "../Destructor";
import { EventWrapper, zzEvent } from "../Event";
import { zzArray, zzComputeArray, zzComputeArrayFn } from "./array";
import { zzCompute, zzComputeFn } from "./compute";
import { zzMap } from "./map";
import { zzObject } from "./object";
import { zzReactive } from "./reactive";
import { zzSet } from "./set";
import { zzTag } from "./tags";
import { zzType } from "./type";
import {
  zzBigInt,
  zzBoolean,
  zzFloat,
  zzInteger,
  zzNumber,
  zzString,
} from "./vars";

export class zz {
  static Value<T>(value: T) {
    return new zzReactive<T>(value);
  }

  static Number<TNumber = number>(value: TNumber = 0 as any) {
    return new zzNumber<TNumber>(value);
  }

  static Integer(value: number = 0) {
    return new zzInteger(value);
  }

  static BigInt(value: BigInt = BigInt(0)) {
    return new zzBigInt(value);
  }

  static Float<TNumber = number>(value: TNumber = 0 as any) {
    return new zzFloat<TNumber>(value);
  }

  static String<TString = string>(value: TString = "" as any) {
    return new zzString<TString>(value);
  }

  static Type<TString = string>(value: TString = "" as any) {
    return new zzType<TString>(value);
  }

  static Boolean(value: boolean = false) {
    return new zzBoolean(value);
  }

  static Compute<T>(callback: () => T) {
    return zzCompute(callback);
  }

  static ComputeArray<T>(callback: () => T[]) {
    return zzComputeArray(callback);
  }

  static Array<T>(value: T[] = []) {
    return new zzArray(value);
  }

  static Map<TKey, TValue>(value: [TKey, TValue][] = []) {
    return new zzMap(value);
  }

  static Set<TValue>(value: TValue[] = []) {
    return new zzSet(value);
  }

  static Object<T>(value: T | null = null) {
    return new zzObject<T>(value);
  }

  static toReactive<T>(variable: zz.variable<T>) {
    if (typeof variable === "function") {
      return zzCompute(variable as any);
    }
    if (Array.isArray(variable)) {
      return zzComputeArray(variable as any);
    }
    if (zzReactive.isReactive(variable)) {
      return variable;
    }

    return new zzReactive<T>(variable as T);
  }

  static If<T, R>(
    cond: zz.variable<T>,
    onTrue: zz.variable<R>,
    onFalse: zz.variable<R>
  ) {
    const c = zz.toReactive(cond);
    const t = zz.toReactive(onTrue);
    const f = zz.toReactive(onFalse);

    return zzCompute(() => (c.value ? t.value : f.value));
  }

  static Event<T extends (...args: any) => void>() {
    return new zzEvent<T>();
  }

  static wrapEvent<T extends (...args: any) => void>(
    element: HTMLElement,
    eventName: Parameters<HTMLElement["addEventListener"]>[0],
    fn: T,
    options: boolean = false
  ) {
    return new EventWrapper(element, eventName, fn, options);
  }

  static Destructor() {
    return new DestructorsStack();
  }

  static get T() {
    return zzTag;
  }
}

export namespace zz {
  export type reactive<T> = zzReactive<T>;
  export type variable<T> = zzReactive<T> | T | (() => T);
}

export namespace zz {
  export type Value<T> = zzReactive<T>;
  export type String<T = string> = zzString<T>;
  export type Type<T> = zzType<T>;
  export type Number = zzNumber;
  export type Integer = zzInteger;
  export type Float = zzFloat;
  export type BigInt = zzBigInt;
  export type Boolean = zzBoolean;
  export type Object<T> = zzObject<T>;
  export type Map<TKey, TValue> = zzMap<TKey, TValue>;
  export type Set<TValue> = zzSet<TValue>;
  export type Array<T> = zzArray<T>;
  export type Compute<T> = zzComputeFn<T>;
  export type ComputeArray<T> = zzComputeArrayFn<T>;
  export type Event<T extends (...args: any) => void> = zzEvent<T>;
  export type Destructor = DestructorsStack;
}
