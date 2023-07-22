import { zz } from "@lizzi/core";
import { Else, If } from "@lizzi/node";
import { AddTodo } from "./AddTodo";
import { SearchComponent } from "./SearchComponent";
import { Todo } from "../data/Todo";
import { TodoView } from "./TodoView";
import { zzHtmlComponent } from "@lizzi/template";

export class TodoApp extends zzHtmlComponent {
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
              <>Empty list</>
              <Else>
                <>Found 0 result</>
              </Else>
            </If>
            <Else>
              <>
                {filteredTodos.map((todo) => (
                  <TodoView
                    todo={todo}
                    onRemove={(todo) => todos.remove([todo])}
                  />
                ))}
              </>
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
