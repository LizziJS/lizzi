import { zz } from "@lizzi/core";
import { App } from "./app";
import { Channel } from "./channel";

export class Message {
  readonly app = zz.object<App>();
  readonly channel = zz.object<Channel>();

  readonly id = zz.string();
  readonly message = zz.string();
  readonly channel_id = zz.string();
  readonly user_id = zz.string();
  readonly date_time = zz.string();

  readonly user = zz.compute(
    () => this.channel.value?.users.get(this.user_id.value).value ?? null
  );

  // update
}
