import { zz } from "@lizzi/core";
import { Else, If, zzNode } from "@lizzi/node";
import { AddTodo } from "./AddTodo";
import { SearchComponent } from "./SearchComponent";
import { Todo } from "../data/Todo";
import { TodoView } from "./TodoView";
import { Text } from "@lizzi/template";

export class TodoApp extends zzNode {
  constructor({ todos }: { todos: zz.Array<Todo> }) {
    super();

    const searchComponent = (<SearchComponent />) as SearchComponent;

    const filteredTodos = todos.filter((todo) => {
      return todo.todo.value
        .toLocaleLowerCase()
        .startsWith(searchComponent.input.value.toLocaleLowerCase());
    });

    const isEmptyTodos = zz.Compute(() => todos.length === 0);
    const isEmptyResults = zz.Compute(() => filteredTodos.length === 0);

    this.append(
      <div class="max-w-2xl w-full mx-auto my-10">
        <div class="my-10">{searchComponent}</div>
        <div class="my-5 mx-5 flex flex-col">
          <If condition={isEmptyResults}>
            <If condition={isEmptyTodos}>
              <Text>Empty list</Text>
              <Else>
                <Text>Found 0 result</Text>
              </Else>
            </If>
            <Else>
              <Text>
                {filteredTodos.map((todo) => (
                  <TodoView
                    todo={todo}
                    onRemove={() => todos.remove([todo])}
                    onDone={() => todo.done.toggle()}
                  />
                ))}
              </Text>
            </Else>
          </If>
        </div>
        <div class="my-10">
          <AddTodo
            onAdd={(newTodo) => todos.add([new Todo({ todo: newTodo })])}
          />
        </div>
      </div>
    );
  }
}
