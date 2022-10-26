import { zzMakeReactive, zzModel, zzReactive, zzRoV } from "@lizzi/core";

export class zzUrlParams<T extends { [key: string]: zzRoV<string> } = {}> {
  readonly url: zzReactive<string>;
  readonly query: zzModel<T | {}>;

  createURL(withQuery: boolean = true) {
    const url = new URL(this.url.value);
    if (withQuery) {
      const query = this.query.value as any;
      for (const queryName in query) {
        url.searchParams.set(queryName, query[queryName]);
      }
    }

    return url;
  }

  createBody() {
    return JSON.stringify(this.query.value);
  }

  constructor(url: zzRoV<string>, query: T | {} = {}) {
    this.url = zzMakeReactive(url);
    this.query = new zzModel(query);
  }
}
