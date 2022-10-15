import { zzArray, zzIf, zzString } from "@lizzi/core";
import { onClick, onInput, ViewComponent } from "@lizzi/template";
import { Todo, Todos } from "./Todo";

export class TodoApp extends ViewComponent {
  constructor() {
    super();

    const todos = new Todos();
    const search = new zzString("");

    todos.add([new Todo("123", false)]);
    todos.add([new Todo("567", true)]);

    this.append(
      <div class="text-4xl text-center text-blue-700">
        <div class="w-full">
          <input class="w-full" use={[onInput(search)]} />
        </div>
        {todos
          .filter((todo) => todo.todo.value.startsWith(search.value), search)
          .map((todo) => (
            <div
              class="flex justify-center items-center gap-3 cursor-pointer"
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
              <div class={[zzIf(todo.done, "line-through", ""), "w-80"]}>
                {todo.todo}
              </div>
              <div
                class="text-sm text-red-500"
                use={[
                  onClick(() => {
                    todos.remove([todo]);
                  }),
                ]}
              >
                X
              </div>
            </div>
          ))}
      </div>
    );
  }
}
