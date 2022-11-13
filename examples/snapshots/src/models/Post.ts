import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { appState } from "./AppState";
import { Comments } from "./Comment";
import { server } from "./ServerSnapshot";

@server.obj
export class Post {
  @server.pri readonly id = new zzInteger(0);
  @server.req readonly title = new zzString("");
  @server.req readonly post = new zzString("");
  @server.var readonly author_id = new zzInteger(0);
  @server.var readonly comments = new Comments();

  readonly author = appState.users.find(
    (user) => user.id.value === this.author_id.value
  );
}

@server.arr(Post)
export class Posts extends zzArray<Post> {}
