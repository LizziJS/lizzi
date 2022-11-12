/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzArray } from "./array";
import { zzReactive } from "./reactive";

interface ISnapshotType<T>{
  readonly prototype: object;
  readonly name: string;
  setter(values: T, lastvalue: T):T | undefined;
  getter(values: T):T;
}

class SnapshotValueType implements ISnapshotType<any>{
  protected snapshot: Snapshot;
  readonly prototype: object;
  readonly name: string;

  setter(values: any, last: any){
    return values;
  }
  
  getter (value: any) { 
    return value instanceof zzReactive ? value.value: value; 
  }

  constructor(snapshot: Snapshot, prototype: object, name: string){
    this.snapshot = snapshot;
    this.prototype = prototype;
    this.name = name;
  }
}

class SnapshotRequiedType extends SnapshotValueType{
  setter(values: any, last: any){
    if (values === undefined) throw new TypeError('Undefined required value '+this.name);

    return values;
  }
}

class SnapshotPrimaryType extends SnapshotRequiedType{
  setter(values: any, last: any){
    if (values === undefined) throw new TypeError('Undefined primary value '+this.name);

    return values;
  }
}

class SnapshotArrayType extends SnapshotValueType{
  protected arrayClass: new () => any;

  setter(arrayUpdate: {[key: string]: any}[], lastArray: {[key: string]: any}[]){
    const ids = Array.from(this.snapshot.prototypesValuesMap.get(this.arrayClass.prototype)?.values() ?? []).filter(value => value instanceof SnapshotPrimaryType).map(value => value.name);

    if (ids.length === 0) throw new Error(this.arrayClass.name+' class hasn\'t primary id');

    return arrayUpdate?.map(values => {
      let item = lastArray.find(value => {
        for (const idName of ids){
          if (value[idName].value !== values[idName]) return false;
        }

        return true;
      });

      if (!item){
        item = new (this.arrayClass)();
      }

      this.snapshot.setValues(item!, values);

      return item;
    })
  }
  
  getter (valuesArray: {[key: string]: any}[]) { 
    return (valuesArray instanceof zzArray ? valuesArray.value: valuesArray).map(item => this.snapshot.getValues(item)); 
  }

  constructor(snapshot: Snapshot, prototype: object, name: string, arrayClass: new () => any){
    super(snapshot, prototype, name);
    this.arrayClass = arrayClass;
  }
}

export class Snapshot {
  readonly prototypesValuesMap = new Map<any, Map<string, ISnapshotType<any>>>();

  pri: (prototype: object, valueName: string) => void;
  var: (prototype: object, valueName: string) => void;
  req: (prototype: object, valueName: string) => void;
  arr: <T extends new () => any>(arrayClass: T, idName?: string) => (prototype: object, valueName: string) => void;

  variables(object: { [key: string]: any }) {
    const values = this.prototypesValuesMap.get(Object.getPrototypeOf(object));

    if (!values) throw new TypeError("Can't getFrom values from " + object);

    const result: { [key: string]: any } = {};

    for (const name of values.keys()) {
      result[name] = object[name];
    }

    return result;
  }

  setValues(object: { [key: string]: any }, values: { [key: string]: any }){
    const vars = this.prototypesValuesMap.get(Object.getPrototypeOf(object));

    if (!vars) throw new TypeError("Can't have values in " + object);

    for (const [name, converter] of vars) {
      const rvalue = object[name];
      if (rvalue instanceof zzReactive) {
        const newValue = converter.setter(values[name], rvalue.value);
        if (newValue){
          rvalue.value = newValue;
        }
      }
    }
  }

  getValues(object: { [key: string]: any }){
    let result: any = {};

    const vars = this.prototypesValuesMap.get(Object.getPrototypeOf(object));

    if (!vars) throw new TypeError("Can't getFrom values from " + object);

    for (const [name, converter] of vars) {
      const value = converter.getter(object[name]);
      if (value){
        result[name] = value;
      }
    }

    return result;
  }

  setup(set: ISnapshotType<any>){
    let setters = this.prototypesValuesMap.get(set.prototype);
    if (!setters) {
      setters = new Map();
      this.prototypesValuesMap.set(set.prototype, setters);
    }

    setters.set(set.name, set);
  }

  constructor() {
    this.var = ((prototype: object, valueName: string) => {
      this.setup(new SnapshotValueType(this, prototype, valueName));
    }).bind(this);

    this.req = ((prototype: object, valueName: string) => {
      this.setup(new SnapshotRequiedType(this, prototype, valueName));
    }).bind(this);

    this.pri = ((prototype: object, valueName: string) => {
      this.setup(new SnapshotPrimaryType(this, prototype, valueName));
    }).bind(this);

    this.arr = (<T extends new () => any>(arrayClass: T) => {
      return (prototype: object, valueName: string) => {
        this.setup(new SnapshotArrayType(this, prototype, valueName, arrayClass));
      };
    }).bind(this);
  }
}
