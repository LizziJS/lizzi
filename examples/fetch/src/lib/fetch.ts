import { zzBoolean, zzObject, zzReactive, zzString } from "@lizzi/core";
import { zzEvent } from "@lizzi/core/Event";
import { JSONValue } from "./json";

export function zzFetch<T extends JSONValue>(
  url: string,
  {
    isLoading,
    isError,
    data,
    errorMessage,
  }: {
    isLoading?: zzBoolean;
    isError?: zzBoolean;
    data?: zzObject<any>;
    errorMessage?: zzString;
  }
) {
  const onComplete = new zzEvent<(jsonData: T) => void>();
  const onError = new zzEvent<(message: string) => void>();

  const runFetch = async () => {
    isLoading && (isLoading.value = true);
    isError && (isError.value = false);
    data && (data.value = null);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        const json = await response.json();
        data && (data.value = json);
        onComplete.emit(json);
      } else {
        isError && (isError.value = true);
        errorMessage && (errorMessage.value = response.statusText);
        onError.emit(response.statusText);
      }
    } catch (error: any) {
      isError && (isError.value = true);
      errorMessage && (errorMessage.value = error.message);
      onError.emit(error.message);
    }

    isLoading && (isLoading.value = false);
  };

  runFetch();

  return { onComplete, onError };
}
