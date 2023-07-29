/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import {
  EventChangeValue,
  Locker,
  zzGetReactiveObserver,
  zzMap,
  zzString,
} from "@lizzi/core";

export class zzUrlSearchParams extends zzMap<string, string> {}

export class zzUrl extends zzString {
  readonly searchParams = new zzUrlSearchParams();

  get href() {
    return this.value;
  }

  get origin() {
    return new URL(this.value).origin;
  }

  get protocol() {
    return new URL(this.value).protocol;
  }

  set protocol(value: string) {
    const url = new URL(this.value);

    url.protocol = value;

    this.value = url.href;
  }

  get username() {
    return new URL(this.value).username;
  }

  set username(value: string) {
    const url = new URL(this.value);

    url.username = value;

    this.value = url.href;
  }

  get password() {
    return new URL(this.value).password;
  }

  set password(value: string) {
    const url = new URL(this.value);

    url.password = value;

    this.value = url.href;
  }

  get host() {
    return new URL(this.value).host;
  }

  set host(value: string) {
    const url = new URL(this.value);

    url.host = value;

    this.value = url.href;
  }

  get hostname() {
    return new URL(this.value).hostname;
  }

  set hostname(value: string) {
    const url = new URL(this.value);

    url.hostname = value;

    this.value = url.href;
  }

  get port() {
    return new URL(this.value).port;
  }

  set port(value: string) {
    const url = new URL(this.value);

    url.port = value;

    this.value = url.href;
  }

  get pathname(): string {
    return new URL(this.value).pathname;
  }

  set pathname(value: string | string[]) {
    const url = new URL(this.value);

    url.pathname = Array.isArray(value) ? value.join("/") : value;

    this.value = url.href;
  }

  get search() {
    return new URL(this.value).search;
  }

  set search(value: string) {
    const url = new URL(this.value);

    url.search = value;

    this.value = url.href;
  }

  get hash() {
    return new URL(this.value).hash;
  }

  set hash(value: string) {
    const url = new URL(this.value);

    url.hash = value;

    this.value = url.href;
  }

  set value(newValue: string) {
    try {
      newValue = new URL(newValue, this.value).href;
    } catch (error) {
      throw new TypeError("Failed to construct 'zzURL': Invalid URL");
    }

    if (this._value !== newValue && this.checkValueTypes(newValue)) {
      let ev = new EventChangeValue<string>(newValue, this._value, this);
      this._value = newValue;

      this.onChange.emit(ev);
    }
  }

  get value(): string {
    zzGetReactiveObserver.add(this);

    return this._value;
  }

  constructor(value?: string) {
    super(value ?? window.location.href);

    const lock = Locker.new();

    this.onChange
      .addListener(
        lock((ev) => {
          const url = new URL(ev.value);

          for (const [key, value] of url.searchParams) {
            this.searchParams.set(key, value);
          }

          for (const [key] of this.searchParams) {
            if (!url.searchParams.has(key)) {
              this.searchParams.delete(key);
            }
          }
        })
      )
      .run(EventChangeValue.new(this));

    this.searchParams.onChange.addListener(
      lock((ev) => {
        const search = new URLSearchParams([...ev.value.entries()]);

        this.search = search.toString();
      })
    );
  }
}
