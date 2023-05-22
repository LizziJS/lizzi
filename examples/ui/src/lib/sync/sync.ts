/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { IDestructor, zzArray, zzInteger, zzReactive } from "@lizzi/core";
import { zzEvent } from "@lizzi/core";
import { v4 } from "uuid";

export type SyncID = string;

export type SyncObjectType<T extends object> =
  | null
  | string
  | number
  | boolean
  | T
  | { [x: string]: SyncObjectType<T> }
  | Array<SyncObjectType<T>>;

export type SyncJSONType = SyncObjectType<{ ___: SyncID }>;

export class zzSync<OType extends object> implements IDestructor {
  readonly onSync = new zzEvent<(item: OType, id: SyncID) => void>();
  readonly onReassign = new zzEvent<
    (item: OType, oldid: SyncID, newid: SyncID) => void
  >();
  readonly onRemove = new zzEvent<(item: OType, id: SyncID) => void>();

  readonly count = new Map<OType, zzInteger>();
  readonly items = new Map<OType, SyncID>();
  readonly ids = new Map<SyncID, OType>();

  get size() {
    return this.items.size;
  }

  destroy() {
    this.clear();
  }

  getItems() {
    return this.items.keys();
  }

  reassign<T extends OType>(item: T, id: SyncID) {
    const syncid = this.items.get(item);
    if (syncid !== undefined) {
      if (id !== syncid) {
        this.ids.delete(syncid);
        this.ids.set(id, item);

        this.items.set(item, id);

        this.onReassign.emit(item, syncid, id);
      }
    }

    return item;
  }

  sync<T extends OType>(item: T, id: SyncID) {
    const counter = this.count.get(item);
    if (counter !== undefined) {
      counter.value++;
    } else {
      this.ids.set(id, item);
      this.items.set(item, id);
      this.count.set(item, new zzInteger(1));

      this.onSync.emit(item, id);
    }

    return item;
  }

  remove(item: OType) {
    const counter = this.count.get(item);
    if (counter !== undefined) {
      counter.value--;
      if (counter.value <= 0) {
        const id = this.items.get(item);
        if (id !== undefined) {
          this.count.delete(item);
          this.items.delete(item);
          this.ids.delete(id);

          this.onRemove.emit(item, id);
        }
      }
    }

    return this;
  }

  clear() {
    for (let item of Array.from(this.ids)) {
      this.onRemove.emit(item[1], item[0]);
    }

    this.items.clear();
    this.ids.clear();

    return this;
  }

  countSync(item: OType) {
    return this.count.get(item)?.value ?? 0;
  }

  get(id: string) {
    return this.ids.get(id) ?? null;
  }

  getId(item: OType) {
    return this.items.get(item) ?? null;
  }

  serialize(data: SyncObjectType<OType>): SyncJSONType {
    if (Array.isArray(data)) {
      return data.map((i) => this.serialize(i));
    } else if (typeof data === "object" && data !== null) {
      let oid = this.items.get(data as OType);
      if (oid !== undefined) {
        return { ___: oid };
      } else if (data.constructor.name !== "Object") {
        //object not an Object
        return null;
      }

      const result: SyncJSONType = {};
      for (let i in data) {
        result[i] = this.serialize((data as any)[i]);
      }

      return result;
    }

    return data;
  }

  unserialize(data: SyncJSONType): any {
    if (Array.isArray(data)) {
      return data.map((i) => this.unserialize(i));
    } else if (typeof data === "object" && data !== null) {
      if ("___" in data) {
        return this.ids.get(data.___ as SyncID) ?? null;
      }

      const result: any = {};
      for (let i in data) {
        result[i] = this.unserialize(data[i]);
      }

      return result;
    }

    return data;
  }
}
