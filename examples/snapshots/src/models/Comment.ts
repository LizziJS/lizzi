import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { Post } from "./Post";
import { server } from "./ServerSnapshot";

@server.object
export class Comment {
  readonly appState = this.comments.appState;

  @server.pri readonly id = new zzInteger(0);
  @server.var readonly comment = new zzString("");
  @server.var readonly post_id = new zzInteger(0);
  @server.var readonly author_id = new zzInteger(0);

  readonly post = this.appState.posts.find(
    (post) => post.id.value === this.post_id.value
  );
  readonly author = this.appState.users.find(
    (user) => user.id.value === this.author_id.value
  );

  constructor(protected readonly comments: Comments) {}
}

@server.array(Comment)
export class Comments extends zzArray<Comment> {
  readonly appState = this.post.appState;

  constructor(public readonly post: Post) {
    super();

    console.log(this.post, this.post.appState);
  }
}
