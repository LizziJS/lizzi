/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzDestructor, DestructorsStack } from "../Destructor";
import { zzIsolatorStack } from "../Isolator";
import { zzEvent } from "../Event";

export class EventChangeValue<T> {
  static new<R extends zzReactive<any>>(target: R) {
    return new EventChangeValue(target.value, target.value, target);
  }

  constructor(
    public readonly value: T,
    public readonly last: T,
    public readonly target: zzReactive<T>
  ) {}
}

export type InferReactive<P extends any> = P extends zzReactive<infer T>
  ? T
  : P;

export interface IReactiveEvent<T> {
  readonly onChange: zzEvent<(event: EventChangeValue<T>) => void>;
}

export interface IReactiveValue<T> {
  value: T;
}

export type IReactive<T> = IReactiveEvent<T> & IReactiveValue<T>;

function hasGetter(obj: any, prop: string): boolean {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) {
    return Boolean(descriptor.get);
  }
  const proto = Object.getPrototypeOf(obj);
  return proto ? hasGetter(proto, prop) : false;
}

export class zzReactive<TValue>
  extends zzDestructor
  implements IReactive<TValue>
{
  static isReactive(check: any): check is zzReactive<any> {
    return hasGetter(check, "value") && zzEvent.isEvent(check.onChange);
  }

  readonly onChange = new zzEvent<(event: EventChangeValue<TValue>) => void>();
  protected _value: TValue;

  destroy(): void {
    this.onChange.destroy();
  }

  get value(): TValue {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  set value(newValue: TValue) {
    if (this._value !== newValue) {
      let ev = new EventChangeValue<TValue>(newValue, this._value, this);
      this._value = newValue;
      this.onChange.emit(ev);
    }
  }

  [Symbol.toPrimitive]() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  constructor(value: TValue) {
    super();

    this._value = value;
  }
}

export class zzType<T> extends zzReactive<T> {
  protected _typeCheckers: ((value: any) => boolean)[] = [];

  validate(fn: (value: any) => boolean) {
    this._typeCheckers.push(fn);

    return this;
  }

  protected checkValueTypes(newValue: T) {
    try {
      if (!this._typeCheckers.every((fn) => fn(newValue))) {
        throw new TypeError(
          newValue + " is not match type " + this.constructor.name
        );
      }
    } catch (error) {
      throw new TypeError(
        newValue + " is not match type " + this.constructor.name + ": " + error
      );
    }

    return true;
  }

  get value(): T {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue && this.checkValueTypes(newValue)) {
      let ev = new EventChangeValue<T>(newValue, this._value, this);
      this._value = newValue;

      this.onChange.emit(ev);
    }
  }

  constructor(value: T) {
    super(value);

    this.checkValueTypes(value);
  }
}

export class zzAny extends zzType<any> {}

class GetReactiveIsolator extends zzIsolatorStack<zzReactive<any>> {
  catch(
    isolatedFn: () => void,
    onUpdateFn: (ev: EventChangeValue<any>) => void
  ): DestructorsStack {
    return new DestructorsStack().addArray(
      this.runIsolated(isolatedFn).map((r) =>
        r.onChange.addListener(onUpdateFn)
      )
    );
  }
}

export const zzGetReactiveObserver = new GetReactiveIsolator();
