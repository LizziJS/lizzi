import { zzArray, zzBoolean, zzCompute, zzObject, zzString } from "@lizzi/core";

export const SHOW_ALL = "show_all";
export const SHOW_COMPLETED = "show_completed";
export const SHOW_ACTIVE = "show_active";

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: (todo: Todo) => !todo.completed.value,
  [SHOW_COMPLETED]: (todo: Todo) => todo.completed.value,
};

export type FILTERS = keyof typeof TODO_FILTERS;

export class Todo {
  readonly id: number;
  readonly text: zzString;
  readonly completed: zzBoolean;
  readonly other: zzObject<Todo>;

  editTodo(text: string) {
    this.text.value = text;
  }

  completeTodo(isComplete: boolean) {
    this.completed.value = isComplete;
  }

  constructor(
    id: number,
    text: string,
    completed: boolean = false,
    other: Todo | null = null
  ) {
    this.id = id;
    this.text = new zzString(text);
    this.completed = new zzBoolean(completed);
    this.other = new zzObject(other);
  }
}

export class AppState {
  readonly filter = new zzString<FILTERS>(SHOW_ALL);
  readonly todos = new zzArray<Todo>();

  readonly visibleTodos = this.todos.filter((todo) =>
    TODO_FILTERS[this.filter.value](todo)
  );

  readonly completedCount = zzCompute(
    () => this.todos.filter((todo) => todo.completed.value).length
  );

  constructor(initialTodos: Todo[]) {
    this.todos.add(initialTodos);
  }

  addTodo(text: string) {
    const todo = new Todo(this.todos.length, text);
    this.todos.add([todo], 0);
    return todo;
  }

  deleteTodo(todo: Todo) {
    this.todos.remove([todo]);
  }

  completeAll() {}

  clearCompleted() {
    this.todos.replace(
      this.todos.toArray().filter((todo) => !todo.completed.value)
    );
  }

  setFilter(filter: FILTERS) {
    this.filter.value = filter;
  }
}
