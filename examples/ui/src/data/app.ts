import { zz } from "@lizzi/core";

import { Channel } from "./channel";

export class App {
  readonly channels = zz.array<Channel>().itemsListener((channel) => {
    channel.app.value = this;
  });

  // open
}
