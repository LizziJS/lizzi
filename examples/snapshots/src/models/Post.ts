import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { AppState } from "./AppState";
import { Comments } from "./Comment";
import { server } from "./ServerSnapshot";

@server.object
export class Post {
  readonly appState = this.posts.appState;

  @server.pri readonly id = new zzInteger(0);
  @server.req readonly title = new zzString("");
  @server.req readonly post = new zzString("");
  @server.var readonly author_id = new zzInteger(0);
  @server.var readonly comments = new Comments(this);

  readonly author = this.appState.users.find(
    (user) => user.id.value === this.author_id.value
  );

  constructor(public readonly posts: Posts) {}
}

@server.array(Post)
export class Posts extends zzArray<Post> {
  constructor(public readonly appState: AppState) {
    super();
  }
}
