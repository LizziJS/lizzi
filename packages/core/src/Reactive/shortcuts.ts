import { DestructorsStack } from "../Destructor";
import { EventWrapper, zzEvent, ExtractEventListener } from "../Event";
import { zzArray } from "./array/array";
import { zzComputeArray } from "./array/compute";
import { IReadOnlyArray } from "./array/readonlyArray";
import { zzCompute } from "./compute";
import { zzMap } from "./map/map";
import { zzObject } from "./object/object";
import { IReadOnlyReactive, zzReactive } from "./reactive";
import { zzSet } from "./set/set";
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

  static makeReactive<T>(variable: zz.ReactiveOrNot<T>): IReadOnlyReactive<T> {
    if (typeof variable === "function") {
      return zzCompute(variable as any);
    }
    if (Array.isArray(variable)) {
      return zzComputeArray(variable as any) as any;
    }
    if (zzReactive.isReactive(variable)) {
      return variable;
    }

    return new zzReactive<T>(variable as T);
  }

  static If<T, R>(
    cond: zz.ReactiveOrNot<T>,
    onTrue: zz.ReactiveOrNot<R>,
    onFalse: zz.ReactiveOrNot<R>
  ) {
    const c = zz.makeReactive(cond);
    const t = zz.makeReactive(onTrue);
    const f = zz.makeReactive(onFalse);

    return zzCompute(() => (c.value ? t.value : f.value));
  }

  static Event<T extends (...args: any) => void>() {
    return new zzEvent<T>();
  }

  static addListener<T extends (...args: any) => void>(
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
  export type ReactiveOrNot<T> = IReadOnlyReactive<T> | T | (() => T);
  export type Reactive<T> = zzReactive<T>;
  export type ReactiveRead<T> = IReadOnlyReactive<T>;
  export type String<T extends string = string> = zzString<T>;
  export type StringRead<T extends string = string> = IReadOnlyReactive<T>;
  export type Type<T> = zzType<T>;
  export type Number = zzNumber;
  export type Integer = zzInteger;
  export type Float = zzFloat;
  export type BigInt = zzBigInt;
  export type Boolean = zzBoolean;
  export type NumberRead = IReadOnlyReactive<number>;
  export type IntegerRead = IReadOnlyReactive<number>;
  export type FloatRead = IReadOnlyReactive<number>;
  export type BigIntRead = IReadOnlyReactive<BigInt>;
  export type BooleanRead = IReadOnlyReactive<boolean>;
  export type Object<T> = zzObject<T>;
  export type ObjectRO<T extends object> = IReadOnlyReactive<T | null>;
  export type Map<TKey, TValue> = zzMap<TKey, TValue>;
  export type Set<TValue> = zzSet<TValue>;
  export type Array<T> = zzArray<T>;
  export type ArrayRead<T> = IReadOnlyArray<T>;
  export type Event<T extends (...args: any) => void> = zzEvent<T>;
  export type ExtractEventListenerFunc<T extends zzEvent<any>> =
    ExtractEventListener<T>;
  export type Destructor = DestructorsStack;
}
