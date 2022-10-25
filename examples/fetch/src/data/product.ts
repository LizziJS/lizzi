import {
  ModelGroup,
  zzArray,
  zzFloat,
  zzInteger,
  zzModel,
  zzString,
} from "@lizzi/core";
import { JSONValue } from "../lib/json";

const json = new ModelGroup();

export class Product {
  @json.add readonly id = new zzInteger(0);
  @json.add readonly title = new zzString("");
  @json.add readonly description = new zzString("");
  @json.add readonly price = new zzFloat(0);
  @json.add readonly discountPercentage = new zzFloat(0);
  @json.add readonly rating = new zzFloat(0);
  @json.add readonly stock = new zzInteger(0);
  @json.add readonly brand = new zzString("");
  @json.add readonly category = new zzString("");
  @json.add readonly thumbnail = new zzString("");
  @json.add readonly images = new zzArray<string>();

  readonly jsonModel = new zzModel(json.getFrom(this));

  jsonUpdate(values: JSONValue) {
    this.jsonModel.value = values;
  }
}

export class Products extends zzArray<Product> {
  jsonUpdate(productList: { id: number; [key: string]: any }[]) {
    if (!Array.isArray(productList))
      throw new TypeError(
        productList + " is not match type " + this.constructor.name
      );

    const lastValues = this.value;

    this.value = productList.map((newProductValues) => {
      let prod = lastValues.find(
        (prod) => prod.id.value === newProductValues.id
      );

      if (!prod) {
        prod = new Product();
      }

      prod.jsonUpdate(newProductValues);

      return prod;
    });
  }
}
