/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { DestructorsStack, IDestructor, zz, zzReactive } from "@lizzi/core";
import { SyncID, SyncJSONType, zzSync } from "../sync";
import { zzSyncFactory } from "../factory";

export class NetworkSyncSerializer<OType extends object>
  implements IDestructor
{
  readonly onUpdate =
    zz.event<
      (data: {
        id: SyncID;
        time: number;
        lock: string | null;
        data: SyncJSONType;
      }) => void
    >();
  readonly onCreate = zz.event<(data: { id: SyncID; type: string }) => void>();
  readonly onDelete = zz.event<(data: { id: SyncID }) => void>();

  readonly sync: zzSync<OType>;
  readonly factory: zzSyncFactory;
  readonly destructor = new DestructorsStack();

  readonly lockers = zz.map<OType, string>();
  readonly times = new Map<OType, number>();
  readonly destructorListeners = new Map<OType, DestructorsStack>();

  constructor(sync: zzSync<OType>, factory: zzSyncFactory) {
    this.sync = sync;
    this.factory = factory;

    this.destructor.add(
      this.sync.onSync.addListener((item) => {
        const destructorStack = new DestructorsStack();

        for (const reactVar of this.factory.getKeys(item)) {
          if (zzReactive.isReactive(reactVar)) {
            destructorStack.add(
              reactVar.onChange.addListener(() => {
                this.onUpdate.emit(this.updateSerialize(item));
              })
            );
          }
        }

        this.destructorListeners.set(item, destructorStack);

        this.onCreate.emit(this.createSerialize(item));
      }),
      this.sync.onRemove.addListener((item, id) => {
        this.lockers.delete(item);
        this.times.delete(item);
        this.destructorListeners.get(item)?.destroy();
        this.destructorListeners.delete(item);

        this.onDelete.emit({ id });
      })
    );
  }

  isLocked<T extends OType>(item: T) {
    return zz.compute(() => (this.lockers.get(item).value ? true : false));
  }

  isSynced<T extends OType>(item: T) {
    return zz.compute(() => true);
  }

  createSerialize(item: OType) {
    const id = this.sync.getId(item);
    if (id === null) throw new TypeError(`Not synced object ${item}`);

    const type = this.factory.getType(item);
    if (type === undefined)
      throw new TypeError(`Not serializable object ${item}`);

    return {
      id,
      type,
    };
  }

  updateSerialize(item: OType) {
    const id = this.sync.getId(item);
    if (id === null) throw new TypeError(`Not synced object ${item}`);

    const time = (this.times.get(item) ?? 0) + 1;
    const lock = this.lockers.toMap().get(item) ?? null;
    const data = this.sync.serialize(this.factory.getValues(item));

    return {
      id,
      time,
      lock,
      data,
    };
  }

  createData(data: { type: string; id: SyncID }) {
    const newInstance = this.factory.create(data.type);
    this.sync.sync(newInstance, data.id);
  }

  updateData(data: {
    id: SyncID;
    time: number;
    lock: string | null;
    data: SyncJSONType;
  }) {
    const instance = this.sync.get(data.id);
    if (instance) {
      this.factory.setValues(instance, this.sync.unserialize(data.data));
    }
  }

  deleteData(data: { id: SyncID }) {
    const instance = this.sync.get(data.id);
    if (instance) {
      this.sync.remove(instance);
    }
  }

  destroy(): void {
    this.destructor.destroy();
    [...this.destructorListeners.values()].forEach((stack) => stack.destroy());
  }
}

export type PacketType = "delete" | "update" | "create" | "reassign";

export class NetworkPacker {
  readonly onSend =
    zz.event<(data: Partial<Record<PacketType, any[]>>) => void>();
  readonly packets = new Map<PacketType, Map<SyncID, any>>();
  timerPrepaired = false;

  constructor(net: NetworkSyncSerializer<any>) {
    net.onDelete.addListener((data) => {
      this.addPacket("delete", data);

      this.deletePacket("create", data.id);
      this.deletePacket("update", data.id);
    });

    net.onCreate.addListener((data) => {
      this.addPacket("create", data);
    });

    net.onUpdate.addListener((data) => {
      this.addPacket("update", data);
    });
  }

  addPacket(type: PacketType, data: { id: SyncID } | { [key: string]: any }) {
    let packet = this.packets.get(type);
    if (packet === undefined) {
      packet = new Map<SyncID, any>();
      this.packets.set(type, packet);
    }

    packet.set(data.id, data);

    this.prepareSendTimer();
  }

  deletePacket(type: PacketType, id: SyncID) {
    return this.packets.get(type)?.delete(id);
  }

  hasPacket(type: PacketType, id: SyncID) {
    return this.packets.get(type)?.has(id);
  }

  getPackets() {
    const result: Partial<Record<PacketType, any[]>> = {};

    for (const [type, packetsMap] of this.packets.entries()) {
      result[type] = Array.from(packetsMap.values());
    }

    return result;
  }

  prepareSendTimer() {
    if (!this.timerPrepaired) {
      setTimeout(() => {
        this.timerPrepaired = false;

        this.onSend.emit(this.getPackets());

        this.packets.clear();
      }, 50);
      this.timerPrepaired = true;
    }
  }
}

export class NetworkUnpacker {
  readonly net;

  receivePackets(packets: Partial<Record<PacketType, any[]>>) {
    if (packets.create) {
      for (const packet of packets.create) {
        this.net.createData(packet);
      }
    }

    if (packets.update) {
      for (const packet of packets.update) {
        this.net.updateData(packet);
      }
    }

    if (packets.delete) {
      for (const packet of packets.delete) {
        this.net.deleteData(packet);
      }
    }
  }

  constructor(net: NetworkSyncSerializer<any>) {
    this.net = net;
  }
}
