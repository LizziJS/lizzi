import { zzArray, zzCompute } from "@lizzi/core";
import { Else, If } from "@lizzi/template";
import { AddTodo } from "./AddTodo";
import { SearchComponent } from "./SearchComponent";
import { Todo } from "../data/Todo";
import { TodoView } from "./TodoView";

export function TodoApp({ todos }: { todos: zzArray<Todo> }) {
  const searchComponent = (<SearchComponent />) as SearchComponent;

  const filteredTodos = todos.filter((todo) =>
    todo.todo.value
      .toLocaleLowerCase()
      .startsWith(searchComponent.search.value.toLocaleLowerCase())
  );

  const isEmptyTodos = zzCompute(() => todos.length === 0);
  const isEmptyResults = zzCompute(() => filteredTodos.length === 0);

  return (
    <div class="max-w-2xl w-full mx-auto my-10">
      <div class="my-10">{searchComponent}</div>
      <div class="my-5 mx-5 flex flex-col">
        <If condition={isEmptyResults}>
          <If condition={isEmptyTodos}>
            Empty list
            <Else>Found 0 result</Else>
          </If>
          <Else>
            {filteredTodos.map((todo) => (
              <TodoView
                todo={todo}
                onRemove={(removeTodo) => todos.remove([removeTodo])}
              />
            ))}
          </Else>
        </If>
      </div>
      <div class="my-10">
        <AddTodo onAdd={(newTodo) => todos.add([new Todo(newTodo, false)])} />
      </div>
    </div>
  );
}
