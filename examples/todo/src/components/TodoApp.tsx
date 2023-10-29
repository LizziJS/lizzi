import { zz } from "@lizzi/core";
import { Else, If, zzNode } from "@lizzi/node";
import { AddTodo } from "./AddTodo";
import { SearchComponent } from "./SearchComponent";
import { Todo, Todos } from "../data/Todo";
import { TodoView } from "./TodoView";
import { Text } from "@lizzi/template";
import { SearchDebug } from "../data/Debug";

export class TodoApp extends zzNode {
  constructor({ todos }: { todos: Todos }) {
    super();

    const searchComponent = (<SearchComponent />) as SearchComponent;

    const filteredTodos = todos.todos
      .filter((todo) => {
        return todo.todo.value
          .toLocaleLowerCase()
          .startsWith(searchComponent.input.value.toLocaleLowerCase());
      })
      .change(SearchDebug.trace("filteredTodos"));

    const todosView = filteredTodos.map((todo) => (
      <TodoView
        todo={todo}
        onRemove={() => todos.remove(todo)}
        onDone={() => todo.toggleDone()}
      />
    ));

    const isEmptyTodos = zz
      .Compute(() => todos.todos.length === 0)
      .change(SearchDebug.trace("isEmptyTodos"));
    const isEmptyResults = zz
      .Compute(() => filteredTodos.length === 0)
      .change(SearchDebug.trace("isEmptyResults"));

    const todosResults = (
      <If condition={isEmptyResults}>
        <If condition={isEmptyTodos}>
          <Text>Empty list</Text>
          <Else>
            <Text>Found 0 result</Text>
          </Else>
        </If>
        <Else>
          <Text>{todosView}</Text>
        </Else>
      </If>
    );

    this.append(
      <div class="max-w-2xl w-full mx-auto my-10">
        <div class="my-10">{searchComponent}</div>
        <div class="my-5 mx-5 flex flex-col">{todosResults}</div>
        <div class="my-10">
          <AddTodo onAdd={(newTodo) => todos.add([new Todo(newTodo)])} />
        </div>
      </div>
    );
  }
}
