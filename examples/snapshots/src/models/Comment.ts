import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { appState } from "./AppState";
import { server } from "./ServerSnapshot";

@server.obj
export class Comment {
  @server.pri readonly id = new zzInteger(0);
  @server.var readonly comment = new zzString("");
  @server.var readonly post_id = new zzInteger(0);
  @server.var readonly author_id = new zzInteger(0);

  readonly post = appState.posts.find(
    (post) => post.id.value === this.post_id.value
  );
  readonly author = appState.users.find(
    (user) => user.id.value === this.author_id.value
  );
}

@server.arr(Comment)
export class Comments extends zzArray<Comment> {}
