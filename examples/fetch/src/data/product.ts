import { zzArray, zzFloat, zzInteger, zzModel, zzString } from "@lizzi/core";
import { Snapshot } from "@lizzi/snapshot";

export const json = new Snapshot();

@json.obj
export class Product {
  @json.pri readonly id = new zzInteger(0);
  @json.var readonly title = new zzString("");
  @json.var readonly description = new zzString("");
  @json.var readonly price = new zzFloat(0);
  @json.var readonly discountPercentage = new zzFloat(0);
  @json.var readonly rating = new zzFloat(0);
  @json.var readonly stock = new zzInteger(0);
  @json.var readonly brand = new zzString("");
  @json.var readonly category = new zzString("");
  @json.var readonly thumbnail = new zzString("");
  @json.var readonly images = new zzArray<string>();
}

@json.arr(Product)
export class Products extends zzArray<Product> {}
