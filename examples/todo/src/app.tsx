import { Body } from "@lizzi/template";
import { zzArray } from "@lizzi/core";

import { TodoApp } from "./components/TodoApp";
import { Todo } from "./data/Todo";

import "./app.css";

const todos = new zzArray<Todo>();

todos.add([
  new Todo("Watch TV", true),
  new Todo("Go shopping", false),
  new Todo("...", false),
  new Todo("Profit!", false),
]);

Body(<TodoApp todos={todos} />);
