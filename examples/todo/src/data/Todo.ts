import { zz } from "@lizzi/core";
import { TodoDebug } from "./Debug";

export class Todo {
  protected readonly _todo: zz.String;
  protected readonly _done: zz.Boolean;
  readonly todo: zz.StringRead;
  readonly done: zz.BooleanRead;

  toggleDone() {
    this._done.toggle();
  }

  constructor(todo: string, done: boolean = false) {
    this._todo = zz.String(todo);
    this._done = zz.Boolean(done);

    this.todo = this._todo.readonly().change(TodoDebug.trace(`todo`));
    this.done = this._done
      .readonly()
      .change(TodoDebug.trace(`done ${this.todo}`));
  }
}

export class Todos {
  protected readonly _todos = zz.Array<Todo>();
  readonly todos = this._todos.readonly().change(TodoDebug.trace("array"));

  add(todo: Todo[]) {
    this._todos.add(todo);
  }

  remove(todo: Todo) {
    this._todos.remove([todo]);
  }
}
