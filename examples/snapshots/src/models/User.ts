import { zzArray, zzEventsAffect, zzInteger, zzString } from "@lizzi/core";
import { AppState } from "./AppState";
import { server } from "./ServerSnapshot";

@server.object
export class User {
  readonly appState = this.users.appState;

  @server.pri readonly id = new zzInteger(0);
  @server.var readonly name = new zzString("");
  @server.var readonly email = new zzString("");

  readonly onChange = zzEventsAffect(...server.varsArray(this));

  constructor(public readonly users: Users) {}
}

@server.array(User)
export class Users extends zzArray<User> {
  constructor(public readonly appState: AppState) {
    super();
  }
}
