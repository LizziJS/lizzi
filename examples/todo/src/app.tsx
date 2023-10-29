import { Body } from "@lizzi/template";
import { Todo, Todos } from "./data/Todo";

import "./app.css";
import { TodoApp } from "./components/TodoApp";

const todos = new Todos();

todos.add([
  new Todo("Check books", true),
  new Todo("Go to library", true),
  new Todo("Learn Lizzi", false),
  new Todo("Find cool job", false),
]);

Body(<TodoApp todos={todos} />);
