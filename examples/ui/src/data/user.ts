import { zz } from "@lizzi/core";
import { App } from "./app";

export class User {
  readonly app = zz.object<App>();

  readonly id = zz.string();
  readonly name = zz.string();
}
