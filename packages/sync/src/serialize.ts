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

export class zzSyncSerializer<IObject extends object> {
  readonly sync;
  readonly factory;

  save(): SaveDataType {
    let result: SaveDataType = [];
    this.sync.items.forEach((id, obj) => {
      const type = this.factory.findType(obj);
      if (type) {
        result.push({
          id,
          type,
          data: this.sync.serialize(this.factory.get(obj)),
        });
      }
    });

    return result;
  }

  create(loadData: SaveDataType) {
    const result: IObject[] = [];

    for (let item of loadData) {
      const newItem = this.factory.create(item.type);

      this.sync.sync(newItem, item.id);

      result.push(newItem);
    }

    return result;
  }

  update(loadData: SaveDataType) {
    for (let item of loadData) {
      const foundItem = this.sync.get(item.id);
      if (foundItem) {
        this.factory.update(foundItem, this.sync.unserialize(item.data));
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

  load(loadData: SaveDataType) {
    const items = this.create(loadData);
    this.update(loadData);

    return items;
  }

  constructor(sync: zzSync<IObject>, factory: zzSyncFactory<IObject>) {
    this.sync = sync;
    this.factory = factory;
  }
}
