import { zzBoolean, zzInteger, zzModel, zzObject, zzString } from "@lizzi/core";

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export class zzFetchApi<TResult extends JSONValue> {
  protected query: zzModel<any>;
  protected url: URL;

  public data: zzObject<TResult>;
  public isLoading: zzBoolean;
  public isError: zzBoolean;

  protected response: zzModel<{
    ok: zzBoolean;
    status: zzInteger;
    statusText: zzString;
  }>;

  get() {
    this.isLoading.value = true;
    this.isError.value = false;

    const queryData = this.query.values();

    const fetchUrl = new URL(this.url);

    for (let key in queryData) {
      fetchUrl.searchParams.append(key, queryData[key]);
    }

    fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        this.response.value = response;

        return response.json();
      })
      .then((json) => {
        this.data.value = json;
      })
      .catch((error) => {
        this.isError.value = true;
      })
      .finally(() => {
        this.isLoading.value = false;
      });
  }

  constructor(url: string, query: zzModel<any>) {
    this.url = new URL(url);
    this.query = query;

    this.data = new zzObject<TResult>(null);
    this.isLoading = new zzBoolean(false);
    this.isError = new zzBoolean(false);

    this.response = new zzModel({
      ok: new zzBoolean(false),
      status: new zzInteger(0),
      statusText: new zzString(""),
    });
  }
}
