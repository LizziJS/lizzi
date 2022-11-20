import { zzArray, zzEventsAffect, zzInteger, zzString } from "@lizzi/core";
import { server } from "./ServerSnapshot";

@server.object
export class User {
  @server.pri readonly id = new zzInteger(0);
  @server.var readonly name = new zzString("");
  @server.var readonly email = new zzString("");

  readonly onChange = zzEventsAffect(...server.varsArray(this));
}

@server.array(User)
export class Users extends zzArray<User> {}
