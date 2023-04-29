import { Body, onClick } from "@lizzi/template";
import { zzArray, zzBoolean } from "@lizzi/core";

import { TodoApp } from "./components/TodoApp";
import { Todo } from "./data/Todo";

import "./app.css";

const todos = new zzArray<Todo>();

todos.add([]);

for (let i = 0; i < 100; i++) {
  todos.add([new Todo("index+" + i, false)]);
}

Body(<TodoApp todos={todos} />);
