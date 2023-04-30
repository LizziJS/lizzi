import { Body } from "@lizzi/template";
import { zzArray } from "@lizzi/core";

import { Todo } from "./data/Todo";

import "./app.css";
import { TodoApp } from "./components/TodoApp";

const todos = new zzArray<Todo>();

todos.add([
  new Todo("Learn JavaScript", true),
  new Todo("Learn TypeScript", true),
  new Todo("Learn Lizzi", false),
  new Todo("Find cool job", false),
]);

Body(<TodoApp todos={todos} />);
