import { zz, zzNot } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { Products } from "../data/product";
import { zzFetch } from "../lib/fetch";
import { zzUrlParams } from "../lib/urlParams";

export function UIApp() {
  const products = new Products();

  const fetch = new zzFetch<{
    products: { id: number }[];
  }>(
    new zzUrlParams(`https://dummyjson.com/products`, {
      select: `thumbnail,title,price`,
    })
  );

  const { isError, isLoading, errorMessage, onComplete } = fetch;

  onComplete.addListener((jsonData: any) => {
    products.fromJSON(jsonData.products);
  });

  fetch.get();

  return (
    <div>
      <If condition={zzNot(isLoading)}>
        <If condition={zzNot(isError)}>
          {products.map((post) => (
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
