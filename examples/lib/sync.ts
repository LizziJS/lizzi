// import { zzSyncFactory } from "./sync/factory";
// import {
//   NetworkPacker,
//   NetworkSyncSerializer,
//   NetworkUnpacker,
// } from "./sync/serializers";
// import { zzSync } from "./sync/sync";

// export const store = new zzSync();
// export const sync = new zzSyncFactory(store);
// export const net = new NetworkSyncSerializer(store, sync);

// const client = new NetworkPacker(net);

// export const store2 = new zzSync();
// export const sync2 = new zzSyncFactory(store2);
// export const net2 = new NetworkSyncSerializer(store2, sync2);

// const server = new NetworkUnpacker(net2);

// client.onSend.addListener((packets) => {
//   server.receivePackets(packets);
//   setTimeout(() => {
//     client2.receivePackets(packets);
//   }, 100);
// });

// export const store3 = new zzSync();
// export const sync3 = new zzSyncFactory(store3);
// export const net3 = new NetworkSyncSerializer(store3, sync3);

// const client2 = new NetworkUnpacker(net3);
