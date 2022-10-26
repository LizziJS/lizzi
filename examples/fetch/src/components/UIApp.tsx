import { zzNot } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { Products } from "../data/product";
import { zzFetch } from "../lib/fetch";

export function UIApp() {
  const posts = new Products();

  const fetch = new zzFetch<{
    products: { id: number }[];
  }>(`https://dummyjson.com/products`);

  const { isError, isLoading, errorMessage, onComplete } = fetch;

  onComplete.addListener((jsonData: any) => {
    posts.fromJSON(jsonData.products);
  });

  fetch.get();

  return (
    <div>
      <If condition={zzNot(isLoading)}>
        <If condition={zzNot(isError)}>
          {posts.map((post) => (
            <div>
              {post.id} {post.thumbnail}
            </div>
          ))}
          <Else>Error: {errorMessage}</Else>
        </If>
        <Else>Loading...</Else>
      </If>
    </div>
  );
}
