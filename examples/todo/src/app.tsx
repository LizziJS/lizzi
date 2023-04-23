import { Body } from "@lizzi/template";
import { zzArray, zzString } from "@lizzi/core";

import { TodoApp } from "./components/TodoApp";
import { Todo } from "./data/Todo";

import "./app.css";
import { SearchComponent } from "./components/SearchComponent";

const todos = new zzArray<Todo>();

todos.add([
  new Todo("Watch TV", true),
  new Todo("Go shopping", false),
  new Todo("...", false),
  new Todo("Profit!", false),
]);

//

Body(
  <div class={"asd"}>
    <SearchComponent />
  </div>
);
