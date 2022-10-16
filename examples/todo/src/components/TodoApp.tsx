import { zzArray, zzBoolean, zzCompute, zzIf, zzString } from "@lizzi/core";
import {
  Else,
  If,
  onClick,
  onEvent,
  onInput,
  ViewComponent,
} from "@lizzi/template";

class Todo {
  readonly todo: zzString;
  readonly done: zzBoolean;

  constructor(todo: string, done: boolean) {
    this.todo = new zzString(todo);
    this.done = new zzBoolean(done);
  }
}

class SearchComponent extends ViewComponent {
  readonly search: zzString;

  constructor() {
    super();

    this.search = new zzString("");

    this.append(
      <div>
        <label
          for="search_todo"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Search
        </label>
        <input
          type="text"
          id="search_todo"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Type search string"
          use={[onInput(this.search)]}
        />
      </div>
    );
  }
}

function TodoView({
  todo,
  onRemove,
}: {
  todo: Todo;
  onRemove: (todo: Todo) => void;
}) {
  return (
    <div
      class="flex items-center gap-3 cursor-pointer p-1 hover:bg-blue-100 rounded"
      use={[onClick(() => (todo.done.value = !todo.done.value))]}
    >
      <div class="border border-2 border-black w-5 h-5 rounded p-0.5">
        <div
          class={[
            zzIf(todo.done, "bg-blue-700", ""),
            "w-full h-full rounded-sm",
          ]}
        ></div>
      </div>
      <div class={[zzIf(todo.done, "line-through", ""), "grow"]}>
        {todo.todo}
      </div>
      <div
        class="text-xl bg-red-500 rounded-full w-6 h-6 leading-none text-white text-center"
        use={[onClick(() => onRemove(todo))]}
      >
        x
      </div>
    </div>
  );
}

function AddTodo({ onAdd }: { onAdd: (todo: string) => void }) {
  const newTodo = new zzString("");

  return (
    <form
      class="w-full flex my-10 gap-2"
      use={[
        onEvent("submit", (ev: SubmitEvent) => {
          ev.preventDefault();

          onAdd(newTodo.value);

          newTodo.value = "";
        }),
      ]}
    >
      <input
        type="text"
        id="add_todo"
        class="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
      dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
      dark:focus:border-blue-500"
        placeholder="Todo"
        use={[onInput(newTodo)]}
      />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32">
        Add todo
      </button>
    </form>
  );
}

export class TodoApp extends ViewComponent {
  constructor() {
    super();

    const todos = new zzArray<Todo>();

    todos.add([
      new Todo("Watch TV", true),
      new Todo("Go shopping", false),
      new Todo("...", false),
      new Todo("Profit!", false),
    ]);

    const searchComponent = (<SearchComponent />) as SearchComponent;

    const filteredTodos = todos.filter(
      (todo) =>
        todo.todo.value
          .toLocaleLowerCase()
          .startsWith(searchComponent.search.value.toLocaleLowerCase()),
      searchComponent.search
    );

    const isNotEmpty = zzCompute(() => filteredTodos.length > 0, filteredTodos);
    const isEmptyTodos = zzCompute(() => todos.length === 0, todos);

    this.append(
      <div class="max-w-2xl w-full mx-auto my-10">
        <div class="w-full my-10">{searchComponent}</div>
        <div class="my-5 mx-5 flex flex-col">
          <If condition={isNotEmpty}>
            {filteredTodos.map((todo) => (
              <TodoView
                todo={todo}
                onRemove={(removeTodo) => todos.remove([removeTodo])}
              />
            ))}
            <Else>
              <If condition={isEmptyTodos}>
                Empty list
                <Else>Found 0 result</Else>
              </If>
            </Else>
          </If>
        </div>
        <AddTodo onAdd={(newTodo) => todos.add([new Todo(newTodo, false)])} />
      </div>
    );
  }
}
