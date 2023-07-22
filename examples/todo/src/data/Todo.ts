import { zz } from "@lizzi/core";

type Props = { todo: string; done?: boolean };

export class Todo {
  readonly todo: zz.String;
  readonly done: zz.Boolean;

  constructor({ todo, done = false }: Props) {
    this.todo = zz.String(todo);
    this.done = zz.Boolean(done);
  }
}
