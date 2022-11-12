import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { server } from "./ServerSnapshot";

export class User{
	@server.pri readonly id = new zzInteger(0);
	@server.var readonly name = new zzString('');
	@server.var readonly email = new zzString('');
}

export class Users extends zzArray<User>{}

