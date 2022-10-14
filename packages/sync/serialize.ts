/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { zzSyncFactory } from "./factory";
import { SyncJSONType, zzSync } from "./sync";

type SaveDataType = {
  id: string;
  type: string;
  data: SyncJSONType;
}[];

export class zzSyncSerializer<ObjectType extends object> {
  readonly sync;
  readonly factory;

  save(getValuesFn: (item: ObjectType) => any): SaveDataType {
    let result: SaveDataType = [];
    this.sync.items.forEach((id, item) => {
      const type = this.factory.findType(item);
      if (type) {
        result.push({
          id,
          type,
          data: this.sync.serialize(getValuesFn(item)),
        });
      }
    });

    return result;
  }

  create(loadData: SaveDataType) {
    const result: ObjectType[] = [];

    for (let item of loadData) {
      const newItem = this.factory.create(item.type);

      this.sync.sync(newItem, item.id);

      result.push(newItem);
    }

    return result;
  }

  update(
    loadData: SaveDataType,
    updateFn: (item: ObjectType, values: any) => void
  ) {
    for (let item of loadData) {
      const foundItem = this.sync.get(item.id);
      if (foundItem) {
        updateFn(foundItem, this.sync.unserialize(item.data));
      }
    }
  }

  delete(deleteIDs: string[]) {
    for (let id of deleteIDs) {
      const foundItem = this.sync.get(id);
      if (foundItem) {
        this.sync.remove(foundItem);
      }
    }
  }

  load(
    loadData: SaveDataType,
    updateFn: (item: ObjectType, values: any) => void
  ) {
    const items = this.create(loadData);
    this.update(loadData, updateFn);

    return items;
  }

  constructor(sync: zzSync<ObjectType>, factory: zzSyncFactory<ObjectType>) {
    this.sync = sync;
    this.factory = factory;
  }
}
