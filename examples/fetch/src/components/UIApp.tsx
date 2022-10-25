import { zzNot, zzBoolean, zzString } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { Products } from "../data/product";
import { zzFetch } from "../lib/fetch";

export function UIApp() {
  const posts = new Products();

  const isLoading = new zzBoolean(false);
  const isError = new zzBoolean(false);
  const errorMessage = new zzString("");

  const fetch = zzFetch<{ products: { id: number }[] }>(
    `https://dummyjson.com/products`,
    { isLoading, isError, errorMessage }
  );

  fetch.onComplete.addListener((jsonData: any) => {
    posts.jsonUpdate(jsonData.products);
  });

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
