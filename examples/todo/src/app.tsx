import { Body } from "@lizzi/template";
import { zzArray } from "@lizzi/core";

import { Todo } from "./data/Todo";

import "./app.css";
import { TodoApp } from "./components/TodoApp";

const todos = new zzArray<Todo>();

todos.add([
  new Todo({ todo: "Check books", done: true }),
  new Todo({ todo: "Go to library", done: true }),
  new Todo({ todo: "Learn Lizzi", done: false }),
  new Todo({ todo: "Find cool job", done: false }),
]);

for (let i = 0; i < 10000; i++) {
  todos.add([new Todo({ todo: `Todo ${i}`, done: false })]);
}

Body(<TodoApp todos={todos} />);
