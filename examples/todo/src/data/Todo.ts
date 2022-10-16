import { zzBoolean, zzString } from "@lizzi/core";

export class Todo {
  readonly todo: zzString;
  readonly done: zzBoolean;

  constructor(todo: string, done: boolean) {
    this.todo = new zzString(todo);
    this.done = new zzBoolean(done);
  }
}
