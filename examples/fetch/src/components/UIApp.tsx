import { zzNot } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { Products } from "../data/product";
import { zzFetch } from "../lib/fetch";
import { zzUrlParams } from "../lib/urlParams";

export function UIApp() {
  const products = new Products();

  const productsApi = new zzFetch(
    new zzUrlParams(`https://dummyjson.com/products`, {
      select: `thumbnail,title,price`,
    })
  );

  productsApi.onComplete.addListener((jsonData: any) => {
    products.fromJSON(jsonData.products);
  });

  productsApi.get();

  return (
    <div>
      <If condition={zzNot(productsApi.isLoading)}>
        <If condition={zzNot(productsApi.isError)}>
          {products.map((post) => (
            <div>
              {post.id} {post.thumbnail}
            </div>
          ))}
          <Else>Error: {productsApi.errorMessage}</Else>
        </If>
        <Else>Loading...</Else>
      </If>
    </div>
  );
}
