import { zzArray, zzInteger, zzString } from "@lizzi/core";
import { appState } from "./AppState";
import { Comment } from "./Comment";
import { server } from "./ServerSnapshot";

export class Post{
    @server.pri readonly id = new zzInteger(0);
    @server.var readonly title = new zzString('');
    @server.var readonly post = new zzString('');
    @server.var readonly author_id = new zzInteger(0);
    @server.arr(Comment) readonly comments = new zzArray<Comment>();
  
    readonly author = appState.users.find((user) => user.id.value === this.author_id.value, this.author_id);
}

export class Posts extends zzArray<Post>{}
