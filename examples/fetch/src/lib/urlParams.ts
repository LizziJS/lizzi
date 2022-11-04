import { zzMakeReactive, zzModel, zzReactive, zzRoV } from "@lizzi/core";

export class zzUrlGetParams<T extends { [key: string]: zzRoV<string> } = {}> {
  readonly url: zzReactive<string>;
  readonly query: zzModel<T | {}>;

  createURL() {
    const url = new URL(this.url.value);
    const query = this.query.value as any;
    for (const queryName in query) {
      url.searchParams.set(queryName, query[queryName]);
    }

    return url;
  }

  constructor(url: zzRoV<string>, query: T | {} = {}) {
    this.url = zzMakeReactive(url);
    this.query = new zzModel(query);
  }
}
