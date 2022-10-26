import { zzBoolean, zzObject, zzReactive, zzString } from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { JSONValue } from "./json";

export class zzFetch<T extends JSONValue> {
  readonly onComplete = new zzEvent<(jsonData: T) => void>();
  readonly onError = new zzEvent<(message: string) => void>();

  readonly isLoading = new zzBoolean(false);
  readonly isError = new zzBoolean(false);
  readonly errorMessage = new zzString("");
  readonly data = new zzObject<T>(null);

  protected setError(message: string) {
    this.errorMessage.value = message;
    this.onError.emit(message);
    this.isError.value = true;
  }

  async get() {
    this.isLoading.value = true;
    this.isError.value = false;
    this.data.value = null;

    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

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

  constructor(public readonly url: string) {}
}
