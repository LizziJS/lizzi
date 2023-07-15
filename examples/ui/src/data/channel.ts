import { zz } from "@lizzi/core";
import { App } from "./app";
import { Message } from "postcss";
import { User } from "./user";

export class Channel {
  readonly app = zz.object<App>();

  readonly id = zz.string();
  readonly name = zz.string();

  readonly messages = zz.array<Message>().itemsListener((message) => {
    zz.compute(() => {
      message.app.value = this.app.value;
    });
    message.channel.value = this;
  });

  readonly users = zz.map<string, User>().itemsListener((user) => {
    zz.compute(() => {
      user.app.value = this.app.value;
    });
  });

  // open
  // close
  // readMessages ( <- server )
  // addMessage ( -> server )
  // update ( -> server )
}
