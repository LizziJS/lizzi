import { DestructorsStack, IDestructor, zzDestructor } from "../Destructor";
import { zzEvent } from "../Event";
import { zzIsolatorStack } from "../Isolator";
import { hasGetter } from "../Tools/hasGetter";

export interface IReactiveEventChange<TValue, TTarget> {
  value: TValue;
  last: TValue;
  target: TTarget;
}

export class ReactiveEventChange<TValue, TTarget>
  implements IReactiveEventChange<TValue, TTarget>
{
  static new<TValue>(
    target: IReadOnlyReactive<TValue>
  ): ReactiveEventChange<TValue, IReadOnlyReactive<TValue>> {
    return new ReactiveEventChange(target.value, target.value, target);
  }

  constructor(
    public readonly value: TValue,
    public readonly last: TValue,
    public readonly target: TTarget
  ) {}
}

export interface IReadOnlyReactive<TValue> extends IDestructor {
  get value(): TValue;
  readonly onChange: zzEvent<
    (event: IReactiveEventChange<TValue, IReadOnlyReactive<TValue>>) => void
  >;
  mapValue<NewT>(
    fn: (value: TValue, last: TValue, target: this) => NewT
  ): IReadOnlyReactive<NewT>;
}

export class zzReadonly<TValue>
  extends zzDestructor
  implements IReadOnlyReactive<TValue>
{
  protected _value: TValue;
  readonly onChange = new zzEvent<
    (event: IReactiveEventChange<TValue, IReadOnlyReactive<TValue>>) => void
  >();

  constructor(value: TValue) {
    super();

    this._value = value;
  }

  destroy(): void {
    this.onChange.destroy();
  }

  get value(): TValue {
    zzReactiveValueGetObserver.add(this);

    return this._value;
  }

  protected set value(set: TValue) {
    if (this._value !== set) {
      let ev = new ReactiveEventChange(set, this._value, this);
      this._value = set;
      this.onChange.emit(ev);
    }
  }

  [Symbol.toPrimitive]() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  mapValue<NewT>(
    fn: (value: TValue, last: TValue, target: this) => NewT
  ): IReadOnlyReactive<NewT> {
    const newReactive = new zzReactive<NewT>(fn(this.value, this.value, this));

    this.onChange.addListener(
      (ev) => (newReactive.value = fn(ev.value, ev.last, this))
    );

    return newReactive.readonly();
  }

  static isReactive(check: any): check is IReadOnlyReactive<any> {
    return (
      check && hasGetter(check, "value") && zzEvent.isEvent(check.onChange)
    );
  }
}

export interface IWriteOnlyReactive<TValue> {
  set value(set: TValue);
}

export class zzReactive<TValue>
  extends zzReadonly<TValue>
  implements IWriteOnlyReactive<TValue>
{
  get value(): TValue {
    zzReactiveValueGetObserver.add(this);

    return this._value;
  }

  set value(set: TValue) {
    if (this._value !== set) {
      let ev = new ReactiveEventChange(set, this._value, this);
      this._value = set;
      this.onChange.emit(ev);
    }
  }

  static isReactive(
    check: any
  ): check is IReadOnlyReactive<any> & IWriteOnlyReactive<any> {
    return (
      check && hasGetter(check, "value") && zzEvent.isEvent(check.onChange)
    );
  }

  readonly() {
    return this as IReadOnlyReactive<TValue>;
  }
}

class GetReactiveIsolator extends zzIsolatorStack<zzReadonly<any>> {
  catch(
    isolatedFn: () => void,
    onUpdateFn: (ev: ReactiveEventChange<any, any>) => void
  ): DestructorsStack {
    return new DestructorsStack().addArray(
      this.isolateAndGet(isolatedFn).map((r) =>
        r.onChange.addListener(onUpdateFn)
      )
    );
  }
}

export const zzReactiveValueGetObserver = new GetReactiveIsolator();
