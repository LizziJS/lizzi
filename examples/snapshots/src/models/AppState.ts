import { Posts } from "./Post";
import { RouteState } from "./RouteState";
import { server } from "./ServerSnapshot";
import { Users } from "./User";

@server.object
export class AppState {
  @server.var readonly posts = new Posts(this);
  @server.var readonly users = new Users(this);
  readonly route = new RouteState();
}
