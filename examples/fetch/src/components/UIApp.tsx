import { zzNot, zzArray } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { zzFetch } from "../lib/fetch";

export function UIApp() {
  const posts = new zzArray<any>([]);
  const { isLoading, onComplete } = zzFetch<{ products: { id: number }[] }>(
    `https://dummyjson.com/products`
  );

  onComplete.addListener((jsonData) => {
    posts.value = jsonData.products;
  });

  return (
    <div>
      <If condition={zzNot(isLoading)}>
        {posts.map((post) => (
          <div>
            {post.id} {post.thumbnail}
          </div>
        ))}
        <Else>Loading...</Else>
      </If>
    </div>
  );
}
