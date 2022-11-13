import { Post, Posts } from "./Post";
import { RouteState } from "./RouteState";
import { server } from "./ServerSnapshot";
import { User, Users } from "./User";

@server.obj
export class AppState {
  @server.var readonly posts = new Posts();
  @server.var readonly users = new Users();
  readonly route = new RouteState();
}

export const appState = new AppState();
