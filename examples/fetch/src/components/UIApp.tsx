import {
  zzInteger,
  zzModel,
  zzString,
  zzS,
  zzNot,
  zzComputeArrayFn,
  zzComputeArray,
  zzArray,
} from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { zzEvent } from "@lizzi/core/Event";
import { zzFetchApi } from "../lib/fetch";

class Post {
  readonly title = new zzString("");
  readonly id = new zzInteger(0);
  readonly cover = new zzString("");

  readonly model = new zzModel({
    title: this.title,
    id: this.id,
    cover: this.cover,
  });
}

export function UIApp() {
  const fetchData = new zzFetchApi<{ id: number }[]>(
    "https://mockend.com/mockend/demo/posts",
    new zzModel({
      tag_eq: "three",
    })
  );

  const posts = zzComputeArray<Post>(
    (currentPosts) =>
      fetchData.data.value?.map((newPost) => {
        let post = currentPosts.find((post) => post.id.value === newPost.id);
        if (!post) {
          post = new Post();
          post.model.value = newPost;
        } else {
          post.model.value = newPost;
        }

        return post;
      }) ?? [],
    fetchData.data
  );

  fetchData.get();

  return (
    <div>
      <If condition={zzNot(fetchData.isLoading)}>
        {posts.map((post) => (
          <div>
            {post.id} {post.cover}
          </div>
        ))}
        <Else>Loading...</Else>
      </If>
    </div>
  );
}
