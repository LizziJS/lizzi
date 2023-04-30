import { DestructorsStack } from "../Destructor";
import { EventWrapper, zzEvent } from "../Event";
import { zzArray } from "./array";
import { zzCompute } from "./compute";
import { zzMap } from "./map";
import { zzObject } from "./object";
import { zzReactive } from "./reactive";
import { zzSet } from "./set";
import { zzTag } from "./tags";
import { zzType } from "./type";
import { zzBoolean, zzFloat, zzInteger, zzNumber, zzString } from "./vars";

export class zz {
  static value<T>(value: T) {
    return new zzReactive<T>(value);
  }

  static number<TNumber = number>(value: TNumber = 0 as any) {
    return new zzNumber<TNumber>(value);
  }

  static integer(value: number = 0) {
    return new zzInteger(value);
  }

  static float<TNumber = number>(value: TNumber = 0 as any) {
    return new zzFloat<TNumber>(value);
  }

  static string<TString = string>(value: TString = "" as any) {
    return new zzString<TString>(value);
  }

  static boolean(value: boolean = false) {
    return new zzBoolean(value);
  }

  static compute<T>(callback: () => T) {
    return zzCompute(callback);
  }

  static array<T>(value: T[] = []) {
    return new zzArray(value);
  }

  static map<TKey, TValue>(value: [TKey, TValue][] = []) {
    return new zzMap(value);
  }

  static set<TValue>(value: TValue[] = []) {
    return new zzSet(value);
  }

  static object<T>(value: T | null = null) {
    return new zzObject<T>(value);
  }

  static type<T>(value: T) {
    return new zzType<T>(value);
  }

  static event<T extends (...args: any) => void>() {
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

  static destructor() {
    return new DestructorsStack();
  }

  static get T() {
    return zzTag;
  }
}

export namespace zz {
  export type reactive<T> = zzReactive<T>;
}
