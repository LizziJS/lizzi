import { zzBoolean, zzObject } from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { JSONValue } from "./json";

export function zzFetch<T extends JSONValue>(url: string) {
  const isLoading = new zzBoolean(true);
  const onComplete = new zzEvent<(jsonData: T) => void>();

  const runFetch = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.ok) {
      onComplete.emit(await response.json());
    }

    isLoading.value = false;
  };

  runFetch();

  return {
    isLoading,
    onComplete,
  };
}
