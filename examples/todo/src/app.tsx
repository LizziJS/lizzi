import { Body, TextNodeView, onClick } from "@lizzi/template";
import { zzArray } from "@lizzi/core";

import { Todo } from "./data/Todo";

import "./app.css";
import { TodoApp } from "./components/TodoApp";

const todos = new zzArray<Todo>();

todos.add([]);

for (let i = 0; i < 10000; i++) {
  todos.add([new Todo("index+" + i, false)]);
}

Body(<TodoApp todos={todos} />);
