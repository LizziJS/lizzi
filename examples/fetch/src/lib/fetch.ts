import {
  zzBoolean,
  zzInteger,
  zzMakeReactive,
  zzObject,
  zzRoV,
  zzString,
} from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { zzUrlGetParams } from "./urlParams";
import { JSONValue } from "./json";

export class zzFetch<T extends JSONValue> {
  readonly onComplete = new zzEvent<(jsonData: T) => void>();
  readonly onError = new zzEvent<(message: string) => void>();

  readonly isLoading = new zzBoolean(false);
  readonly isError = new zzBoolean(false);
  readonly status = new zzInteger(0);
  readonly errorMessage = new zzString("");
  readonly data = new zzObject<T>(null);

  readonly url: zzUrlGetParams;

  protected setError(message: string) {
    this.errorMessage.value = message;
    this.onError.emit(message);
    this.isError.value = true;
  }

  async fetch() {
    if (this.isLoading.value) return;

    this.isLoading.value = true;
    this.isError.value = false;
    this.data.value = null;
    this.status.value = 0;

    try {
      const response = await fetch(this.url.createURL(), {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      this.status.value = response.status;

      if (response.ok) {
        const json = await response.json();
        this.data.value = json;
        this.onComplete.emit(json);
      } else {
        this.setError(response.statusText);
      }
    } catch (error: any) {
      this.setError(error.message);
    }

    this.isLoading.value = false;
  }

  constructor(url: zzRoV<string> | zzUrlGetParams) {
    this.url =
      url instanceof zzUrlGetParams
        ? url
        : new zzUrlGetParams(zzMakeReactive(url));
  }
}
