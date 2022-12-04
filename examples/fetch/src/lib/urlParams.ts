import {
  toValue,
  zzMakeReactive,
  zzReactive,
  ValueOrReactive,
} from "@lizzi/core";

export class zzUrlGetParams<
  T extends {
    [key: string]: ValueOrReactive<string> | ValueOrReactive<number>;
  } = {}
> {
  readonly url: zzReactive<string>;
  readonly query: T;

  getOptions() {
    return {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
  }

  createURL() {
    const url = new URL(this.url.value);
    for (const queryName in this.query) {
      url.searchParams.set(
        queryName,
        String(toValue<any>(this.query[queryName]))
      );
    }

    return url;
  }

  constructor(url: ValueOrReactive<string>, query: T) {
    this.url = zzMakeReactive(url);
    this.query = query;
  }
}
