import { zzBoolean, zzCompute, zzInteger, zzNot } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { json, Products, Product } from "../data/product";
import { zzFetch } from "../lib/fetch";
import { zzUrlGetParams } from "../lib/urlParams";

function ProductView({ product }: { product: Product }) {
  return (
    <div class="w-96">
      <div>{product.id}</div>
      <div>
        {product.title}, ${product.price}
      </div>
      <img src={product.thumbnail} alt="" />
    </div>
  );
}

export function FetchApp() {
  const products = new Products();
  const limit = 10;
  const skip = new zzInteger(0);
  const hasNextPage = new zzBoolean(true);

  const productsApi = new zzFetch(
    new zzUrlGetParams(`https://dummyjson.com/products`, {
      select: `thumbnail,title,price`,
      limit,
      skip,
    })
  );

  productsApi.onComplete.addListener((jsonData: any) => {
    if (jsonData.products.length === 0) {
      hasNextPage.value = false;
      return;
    }

    json.setValues(products, jsonData.products);
  });

  productsApi.fetch();

  const productsMapView = products.map((product) => (
    <ProductView product={product} />
  ));

  const lastProductView = zzCompute(() => productsMapView.toArray().at(-1));
  const lastProductObserver = new IntersectionObserver((posts) => {
    if (posts[0].isIntersecting) {
      if (hasNextPage.value && !productsApi.isLoading.value) {
        skip.value = products.length;
        productsApi.fetch();
      }
    }
  });

  lastProductView.onChange.addListener(() => {
    lastProductObserver.disconnect();

    if (lastProductView.value) {
      const element = lastProductView.value.getFirstElement();
      if (element) {
        lastProductObserver.observe(element);
      }
    }
  });

  return (
    <div class="flex flex-wrap gap-5 justify-center">
      {productsMapView}
      <If condition={zzNot(productsApi.isLoading)}>
        <If condition={zzNot(productsApi.isError)}>
          <Else>Error: {productsApi.errorMessage}</Else>
        </If>
        <Else>
          <div class="w-full text-center">Loading...</div>
        </Else>
      </If>
    </div>
  );
}
